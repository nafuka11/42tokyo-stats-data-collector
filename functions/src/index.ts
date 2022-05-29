import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";
import { saveCursusUsers } from "./collectCursusUsers";
import { SCHEDULE, TIMEOUT_SECONDS, TIMEZONE } from "./utils/constants";
import { getEnv } from "./utils/getEnv";

admin.initializeApp();

export const collectCursusUsers = functions
  .runWith({
    timeoutSeconds: TIMEOUT_SECONDS,
    secrets: ["FT_CLIENT_ID", "FT_CLIENT_SECRET"],
  })
  .pubsub.schedule(SCHEDULE)
  .timeZone(TIMEZONE)
  .onRun(async () => {
    const bucket = getStorage().bucket(getEnv("BUCKET_NAME"));
    await saveCursusUsers(bucket);
    return null;
  });
