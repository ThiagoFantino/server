/*
  Warnings:

  - You are about to alter the column `calorias` on the `UserStats` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserStats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entrenamientos" INTEGER NOT NULL DEFAULT 0,
    "calorias" REAL NOT NULL DEFAULT 0.0,
    "tiempo" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "UserStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserStats" ("calorias", "entrenamientos", "fecha", "id", "tiempo", "userId") SELECT "calorias", "entrenamientos", "fecha", "id", "tiempo", "userId" FROM "UserStats";
DROP TABLE "UserStats";
ALTER TABLE "new_UserStats" RENAME TO "UserStats";
CREATE UNIQUE INDEX "UserStats_userId_fecha_key" ON "UserStats"("userId", "fecha");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
