import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";
import { saveCursusUsersToStorage } from "./collectCursusUsers";
import { TIMEOUT_SECONDS } from "./constants";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp();

export const collectCursusUsers = functions
  .runWith({ timeoutSeconds: TIMEOUT_SECONDS })
  .pubsub.schedule("every day 00:00")
  .timeZone("Asia/Tokyo")
  .onRun(async () => {
    const bucket = getStorage().bucket();
    await saveCursusUsersToStorage(bucket);
    return null;
  });
