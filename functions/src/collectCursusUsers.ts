import { fetchAccessToken, getCursusUsers, initClient } from "./ftApi";
import { Bucket } from "@google-cloud/storage";
import { sanitizeCursusUsers } from "./sanitize";
import { saveCursusUsersToBucket } from "./bucket";

export const saveCursusUsers = async (bucket: Bucket) => {
  const client = initClient();
  const accessToken = await fetchAccessToken(client);
  const cursusUsers = await getCursusUsers(accessToken);
  sanitizeCursusUsers(cursusUsers);
  saveCursusUsersToBucket(bucket, cursusUsers);
};
