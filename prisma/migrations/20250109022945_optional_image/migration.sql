-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "calorias" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Exercise" ("calorias", "id", "image", "name") SELECT "calorias", "id", "image", "name" FROM "Exercise";
DROP TABLE "Exercise";
ALTER TABLE "new_Exercise" RENAME TO "Exercise";
CREATE TABLE "new_Routine" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "isCustom" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Routine" ("id", "image", "isCustom", "name") SELECT "id", "image", "isCustom", "name" FROM "Routine";
DROP TABLE "Routine";
ALTER TABLE "new_Routine" RENAME TO "Routine";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
