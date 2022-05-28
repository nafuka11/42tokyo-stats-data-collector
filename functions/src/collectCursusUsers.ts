import { fetchAccessToken, getCursusUsers, initClient } from "./ftApi";
import { Bucket } from "@google-cloud/storage";
import { format } from "date-fns";

export const saveCursusUsersToStorage = async (bucket: Bucket) => {
  const client = initClient();
  const accessToken = await fetchAccessToken(client);
  const cursusUsers = await getCursusUsers(accessToken);
  const dateStr = format(new Date(), "yyyy-MM-dd");
  await bucket
    .file(`cursus_users/${dateStr}.json`)
    .save(JSON.stringify(cursusUsers));
};
