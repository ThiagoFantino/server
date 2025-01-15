/*
  Warnings:

  - You are about to drop the column `routineId` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `sets` on the `Exercise` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "RoutineExercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "routineId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    CONSTRAINT "RoutineExercise_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RoutineExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Routine" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "isCustom" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Routine" ("id", "image", "name") SELECT "id", "image", "name" FROM "Routine";
DROP TABLE "Routine";
ALTER TABLE "new_Routine" RENAME TO "Routine";
CREATE TABLE "new_Exercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "calorias" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Exercise" ("calorias", "id", "image", "name") SELECT "calorias", "id", "image", "name" FROM "Exercise";
DROP TABLE "Exercise";
ALTER TABLE "new_Exercise" RENAME TO "Exercise";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
