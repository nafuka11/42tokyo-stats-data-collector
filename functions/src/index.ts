import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";
import { SCHEDULE, TIMEOUT_SECONDS, TIMEZONE } from "./constants";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp();

export const collectCursusUsers = functions
  .runWith({ timeoutSeconds: TIMEOUT_SECONDS })
  .pubsub.schedule(SCHEDULE)
  .timeZone(TIMEZONE)
  .onRun(async () => {
    const bucket = getStorage().bucket();
    await saveCursusUsersToStorage(bucket);
    return null;
  });
