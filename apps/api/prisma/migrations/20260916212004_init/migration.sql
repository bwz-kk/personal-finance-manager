-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "categoryId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "limitMinor" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Budget_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "assetType" TEXT NOT NULL,
    "institution" TEXT,
    "currency" TEXT NOT NULL,
    "quantity" TEXT,
    "purchasePriceMinor" INTEGER,
    "purchaseDate" DATETIME,
    "currentValueMinor" INTEGER,
    "watchlistSymbol" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "InvestmentTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "investmentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "quantity" TEXT,
    "pricePerUnitMinor" INTEGER,
    "date" DATETIME NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InvestmentTransaction_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "Investment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "targetAmountMinor" INTEGER NOT NULL,
    "currentAmountMinor" INTEGER NOT NULL DEFAULT 0,
    "targetDate" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "InvestmentPlanConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "minMonthlyInvestmentMinor" INTEGER NOT NULL DEFAULT 0,
    "targetInvestmentRate" REAL NOT NULL DEFAULT 0.1,
    "minCashBufferMinor" INTEGER NOT NULL DEFAULT 0,
    "maxPercentOfAvailableCash" REAL NOT NULL DEFAULT 0.5,
    "expectedRecurringExpensesMinor" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WatchlistItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "symbol" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "assetClass" TEXT NOT NULL,
    "baseCurrency" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "MarketPriceCache" (
    "symbol" TEXT NOT NULL PRIMARY KEY,
    "price" TEXT NOT NULL,
    "asOf" DATETIME NOT NULL,
    "source" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_type_key" ON "Category"("name", "type");

-- CreateIndex
CREATE INDEX "Transaction_date_idx" ON "Transaction"("date");

-- CreateIndex
CREATE INDEX "Transaction_categoryId_idx" ON "Transaction"("categoryId");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- CreateIndex
CREATE INDEX "Budget_month_idx" ON "Budget"("month");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_categoryId_month_key" ON "Budget"("categoryId", "month");

-- CreateIndex
CREATE INDEX "InvestmentTransaction_investmentId_idx" ON "InvestmentTransaction"("investmentId");

-- CreateIndex
CREATE INDEX "InvestmentTransaction_date_idx" ON "InvestmentTransaction"("date");

-- CreateIndex
CREATE UNIQUE INDEX "WatchlistItem_symbol_key" ON "WatchlistItem"("symbol");
