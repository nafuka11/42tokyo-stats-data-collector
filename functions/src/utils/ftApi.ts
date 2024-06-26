import { isBoom } from "@hapi/boom";
import axios, { AxiosError, AxiosInstance } from "axios";
import axiosRetry, {
  exponentialDelay,
  isNetworkOrIdempotentRequestError,
} from "axios-retry";
import * as functions from "firebase-functions";
import { AccessToken, ClientCredentials } from "simple-oauth2";
import parseLinkHeader = require("parse-link-header");
import { CAMPUS_ID, CURSUS_ID, FT_API_ENDPOINT } from "./constants";
import { getEnv } from "./getEnv";
import { CursusUser } from "../types/CursusUser";
import { sleep } from "./sleep";

export const initClient = (): ClientCredentials => {
  const clientId = getEnv("FT_CLIENT_ID");
  const clientSecret = getEnv("FT_CLIENT_SECRET");

  const client = new ClientCredentials({
    client: {
      id: clientId,
      secret: clientSecret,
    },
    auth: {
      tokenHost: FT_API_ENDPOINT,
    },
  });

  return client;
};

export const fetchAccessToken = async (
  client: ClientCredentials
): Promise<AccessToken> => {
  const tokenParams = {
    scope: "public",
  };

  try {
    const accessToken = await client.getToken(tokenParams);
    return accessToken;
  } catch (error: unknown) {
    if (isBoom(error)) {
      functions.logger.error("error with fetchAccessToken", {
        error: error.output,
      });
    }
    throw error;
  }
};

export const getCursusUsers = async (accessToken: AccessToken) => {
  const axiosInstance = initAxiosInstance(accessToken);

  let cursusUsers: CursusUser[] = [];
  let pageNumber = 1;
  let hasNext = true;

  while (hasNext) {
    const response = await getCursusUser(axiosInstance, pageNumber);
    cursusUsers = [...cursusUsers, ...response.data];
    const linkHeader = response.headers.link;
    const parsedLinkHeader = parseLinkHeader(linkHeader);
    hasNext = !!parsedLinkHeader?.next;
    pageNumber++;
  }

  return cursusUsers;
};

const initAxiosInstance = (accessToken: AccessToken): AxiosInstance => {
  const axiosInstance = createAxiosInstance(accessToken);

  setAxiosInterceptor(axiosInstance);
  setAxiosRetry(axiosInstance);

  return axiosInstance;
};

const createAxiosInstance = (accessToken: AccessToken): AxiosInstance => {
  return axios.create({
    baseURL: FT_API_ENDPOINT,
    headers: {
      authorization: `Bearer ${accessToken.token.access_token}`,
    },
  });
};

const setAxiosInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(async (response) => {
    const secondlyRateLimit = parseInt(
      response.headers["x-secondly-ratelimit-limit"] || "2",
      10
    );
    const secondlyRateLimitRemaining = parseInt(
      response.headers["x-secondly-ratelimit-remaining"] || "0",
      10
    );

    if (secondlyRateLimitRemaining === 0 && secondlyRateLimit > 0) {
      const sleepTime = 1000 / secondlyRateLimit;
      functions.logger.info("sleeping", { sleepTime });
      await sleep(sleepTime);
    }
    functions.logger.info("data fetching", {
      data: JSON.stringify(response.data),
      url: response.config.params,
    });
    return response;
  });
};

const setAxiosRetry = (axiosInstance: AxiosInstance) => {
  const rateLimitExceededError = (error: AxiosError) => {
    return error.response?.status === 429;
  };

  axiosRetry(axiosInstance, {
    retries: 5,
    retryDelay: (retryCount: number) => exponentialDelay(retryCount) + 500,
    retryCondition: (error: AxiosError) =>
      isNetworkOrIdempotentRequestError(error) || rateLimitExceededError(error),
    onRetry: (retryCount: number, error: AxiosError) => {
      functions.logger.error("retry because AxiosError occurred", {
        retryCount,
        error,
      });
    },
  });
};

const getCursusUser = async (
  axiosInstance: AxiosInstance,
  pageNumber: number
) => {
  const response = await axiosInstance.get("/v2/cursus_users", {
    params: {
      "filter[campus_id]": CAMPUS_ID,
      "filter[cursus_id]": CURSUS_ID,
      "page[size]": 100,
      "page[number]": pageNumber,
    },
  });
  return response;
};
