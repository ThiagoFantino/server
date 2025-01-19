/*
  Warnings:

  - You are about to alter the column `calorias` on the `Exercise` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "calorias" REAL NOT NULL DEFAULT 0.0
);
INSERT INTO "new_Exercise" ("calorias", "id", "image", "name") SELECT "calorias", "id", "image", "name" FROM "Exercise";
DROP TABLE "Exercise";
ALTER TABLE "new_Exercise" RENAME TO "Exercise";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
