-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Routine" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER,
    CONSTRAINT "Routine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Routine" ("id", "image", "isCustom", "name") SELECT "id", "image", "isCustom", "name" FROM "Routine";
DROP TABLE "Routine";
ALTER TABLE "new_Routine" RENAME TO "Routine";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
