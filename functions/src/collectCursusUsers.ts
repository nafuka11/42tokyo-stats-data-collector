import { fetchAccessToken, getCursusUsers, initClient } from "./utils/ftApi";
import { Bucket } from "@google-cloud/storage";
import { sanitizeCursusUsers } from "./utils/sanitize";
import { saveCursusUsersToBucket } from "./utils/bucket";

export const saveCursusUsers = async (bucket: Bucket) => {
  const client = initClient();
  const accessToken = await fetchAccessToken(client);
  const cursusUsers = await getCursusUsers(accessToken);
  sanitizeCursusUsers(cursusUsers);
  saveCursusUsersToBucket(bucket, cursusUsers);
};
