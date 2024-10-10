-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "calorias" INTEGER NOT NULL DEFAULT 0,
    "entrenamientos" INTEGER NOT NULL DEFAULT 0,
    "minutos" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_User" ("apellido", "id", "nombre") SELECT "apellido", "id", "nombre" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
