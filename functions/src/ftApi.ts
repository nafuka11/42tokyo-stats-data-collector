import { isBoom } from "@hapi/boom";
import axios, { AxiosInstance } from "axios";
import * as functions from "firebase-functions";
import { AccessToken, ClientCredentials } from "simple-oauth2";
import parseLinkHeader = require("parse-link-header");
import { CAMPUS_ID, CURSUS_ID, FT_API_ENDPOINT } from "./constants";
import { getEnv } from "./utils/getEnv";
import { CursusUser } from "./types/CursusUser";
import { sleep } from "./utils/sleep";

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
      console.log(error.output);
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
  const axiosInstance = axios.create({
    baseURL: FT_API_ENDPOINT,
    headers: {
      authorization: `Bearer ${accessToken.token.access_token}`,
    },
  });
  axiosInstance.interceptors.response.use(async (response) => {
    const secondlyRateLimit = parseInt(
      response.headers["x-secondly-ratelimit-limit"],
      10
    );
    const secondlyRateLimitRemaining = parseInt(
      response.headers["x-secondly-ratelimit-remaining"],
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

  return axiosInstance;
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
