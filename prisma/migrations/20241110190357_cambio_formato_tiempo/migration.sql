/*
  Warnings:

  - You are about to drop the column `minutos` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "calorias" INTEGER NOT NULL DEFAULT 0,
    "entrenamientos" INTEGER NOT NULL DEFAULT 0,
    "tiempo" INTEGER NOT NULL DEFAULT 0,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_User" ("apellido", "calorias", "email", "entrenamientos", "id", "nombre", "password") SELECT "apellido", "calorias", "email", "entrenamientos", "id", "nombre", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
