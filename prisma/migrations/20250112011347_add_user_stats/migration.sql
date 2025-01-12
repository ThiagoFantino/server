-- CreateTable
CREATE TABLE "UserStats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entrenamientos" INTEGER NOT NULL DEFAULT 0,
    "calorias" INTEGER NOT NULL DEFAULT 0,
    "tiempo" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "UserStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserStats_userId_fecha_key" ON "UserStats"("userId", "fecha");
