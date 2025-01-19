/*
  Warnings:

  - You are about to drop the column `calorias` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `entrenamientos` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tiempo` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT '',
    "profilePicture" TEXT NOT NULL DEFAULT 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'
);
INSERT INTO "new_User" ("apellido", "email", "id", "nombre", "password", "profilePicture") SELECT "apellido", "email", "id", "nombre", "password", "profilePicture" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
