/*
  Warnings:

  - You are about to drop the column `purchasePriceMinor` on the `Investment` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Investment` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Investment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "assetType" TEXT NOT NULL,
    "institution" TEXT,
    "currency" TEXT NOT NULL,
    "purchaseDate" DATETIME,
    "currentValueMinor" INTEGER,
    "watchlistSymbol" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Investment" ("assetType", "createdAt", "currency", "currentValueMinor", "id", "institution", "name", "notes", "purchaseDate", "updatedAt", "watchlistSymbol") SELECT "assetType", "createdAt", "currency", "currentValueMinor", "id", "institution", "name", "notes", "purchaseDate", "updatedAt", "watchlistSymbol" FROM "Investment";
DROP TABLE "Investment";
ALTER TABLE "new_Investment" RENAME TO "Investment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
