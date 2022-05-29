import { CursusUser, PrivateUserProperties, User } from "../types/CursusUser";

export const sanitizeCursusUsers = (cursusUsers: CursusUser[]) => {
  cursusUsers.forEach((cursusUser) => sanitizeUser(cursusUser.user));
};

const sanitizeUser = (user: User) =>
  PrivateUserProperties.forEach((prop) => delete user[prop]);
