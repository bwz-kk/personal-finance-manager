-- AlterTable
ALTER TABLE "Investment" ADD COLUMN "cdiPercent" REAL;

-- CreateTable
CREATE TABLE "CdiDailyRate" (
    "date" DATETIME NOT NULL PRIMARY KEY,
    "ratePercent" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InvestmentTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "investmentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "quantity" TEXT,
    "pricePerUnitMinor" INTEGER,
    "date" DATETIME NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cashTransactionId" TEXT,
    CONSTRAINT "InvestmentTransaction_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "Investment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InvestmentTransaction_cashTransactionId_fkey" FOREIGN KEY ("cashTransactionId") REFERENCES "Transaction" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_InvestmentTransaction" ("amountMinor", "createdAt", "date", "id", "investmentId", "notes", "pricePerUnitMinor", "quantity", "type") SELECT "amountMinor", "createdAt", "date", "id", "investmentId", "notes", "pricePerUnitMinor", "quantity", "type" FROM "InvestmentTransaction";
DROP TABLE "InvestmentTransaction";
ALTER TABLE "new_InvestmentTransaction" RENAME TO "InvestmentTransaction";
CREATE UNIQUE INDEX "InvestmentTransaction_cashTransactionId_key" ON "InvestmentTransaction"("cashTransactionId");
CREATE INDEX "InvestmentTransaction_investmentId_idx" ON "InvestmentTransaction"("investmentId");
CREATE INDEX "InvestmentTransaction_date_idx" ON "InvestmentTransaction"("date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
