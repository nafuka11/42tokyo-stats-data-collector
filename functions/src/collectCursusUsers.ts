import { fetchAccessToken, getCursusUsers, initClient } from "./ftApi";
import { Bucket } from "@google-cloud/storage";
import { format } from "date-fns";
import { sanitizeCursusUsers } from "./sanitize";

export const saveCursusUsersToStorage = async (bucket: Bucket) => {
  const client = initClient();
  const accessToken = await fetchAccessToken(client);
  const cursusUsers = await getCursusUsers(accessToken);
  sanitizeCursusUsers(cursusUsers);

  const dateStr = format(new Date(), "yyyy-MM-dd");
  await bucket
    .file(`cursus_users/${dateStr}.json`)
    .save(JSON.stringify(cursusUsers));
};
