import { Bucket } from "@google-cloud/storage";
import { format } from "date-fns";
import { CursusUser } from "./types/CursusUser";

export const saveCursusUsersToBucket = async (
  bucket: Bucket,
  cursusUsers: CursusUser[]
) => {
  const file = generateFile(bucket);
  await file.save(JSON.stringify(cursusUsers));
};

const generateFile = (bucket: Bucket) => {
  const dateStr = format(new Date(), "yyyy-MM-dd");
  return bucket.file(`v1/cursus_users/${dateStr}.json`);
};
