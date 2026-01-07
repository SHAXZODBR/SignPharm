-- Drug Audit Extension Tables
-- Run this SQL in Supabase SQL Editor to add the new tables

-- ============================================
-- DISTRIBUTOR Table
-- ============================================
CREATE TABLE IF NOT EXISTS "Distributor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameRu" TEXT,
    "country" TEXT,
    "region" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "inn" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Distributor_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- ATX Classification Reference Table
-- ============================================
CREATE TABLE IF NOT EXISTS "ATXClassification" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL UNIQUE,
    "level" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "nameRu" TEXT,
    "nameUz" TEXT,
    "parentCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ATXClassification_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- EPhMRA Classification Reference Table
-- ============================================
CREATE TABLE IF NOT EXISTS "EPhMRAClassification" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL UNIQUE,
    "level" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "nameRu" TEXT,
    "parentCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EPhMRAClassification_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- Country Reference Table
-- ============================================
CREATE TABLE IF NOT EXISTS "Country" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "nameRu" TEXT,
    "nameUz" TEXT,
    "region" TEXT,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- Currency Exchange Rate Table
-- ============================================
CREATE TABLE IF NOT EXISTS "ExchangeRate" (
    "id" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "rateToUZS" DOUBLE PRECISION NOT NULL,
    "rateToUSD" DOUBLE PRECISION NOT NULL,
    "date" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExchangeRate_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- Market Data / Sales Analytics Table
-- ============================================
CREATE TABLE IF NOT EXISTS "MarketData" (
    "id" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "distributorId" TEXT,
    "pharmacyId" TEXT,
    "period" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "quarter" INTEGER,
    "month" INTEGER,
    "quantitySold" INTEGER NOT NULL DEFAULT 0,
    "totalAmountUZS" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmountUSD" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "marketSharePercent" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketData_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "MarketData_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE CASCADE,
    CONSTRAINT "MarketData_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "Distributor"("id") ON DELETE SET NULL,
    CONSTRAINT "MarketData_pharmacyId_fkey" FOREIGN KEY ("pharmacyId") REFERENCES "Pharmacy"("id") ON DELETE SET NULL
);

-- ============================================
-- Filter Templates Table
-- ============================================
CREATE TABLE IF NOT EXISTS "FilterTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "filters" JSONB NOT NULL,
    "userId" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FilterTemplate_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- Enable Row Level Security (RLS)
-- ============================================
ALTER TABLE "Distributor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ATXClassification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EPhMRAClassification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Country" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ExchangeRate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MarketData" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FilterTemplate" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Create Policies for Public Read Access
-- ============================================
CREATE POLICY "Public read access for Distributor" ON "Distributor" FOR SELECT USING (true);
CREATE POLICY "Public insert access for Distributor" ON "Distributor" FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for Distributor" ON "Distributor" FOR UPDATE USING (true);
CREATE POLICY "Public delete access for Distributor" ON "Distributor" FOR DELETE USING (true);

CREATE POLICY "Public read access for ATXClassification" ON "ATXClassification" FOR SELECT USING (true);
CREATE POLICY "Public insert access for ATXClassification" ON "ATXClassification" FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access for EPhMRAClassification" ON "EPhMRAClassification" FOR SELECT USING (true);
CREATE POLICY "Public insert access for EPhMRAClassification" ON "EPhMRAClassification" FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access for Country" ON "Country" FOR SELECT USING (true);
CREATE POLICY "Public insert access for Country" ON "Country" FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access for ExchangeRate" ON "ExchangeRate" FOR SELECT USING (true);
CREATE POLICY "Public insert access for ExchangeRate" ON "ExchangeRate" FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access for MarketData" ON "MarketData" FOR SELECT USING (true);
CREATE POLICY "Public insert access for MarketData" ON "MarketData" FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for MarketData" ON "MarketData" FOR UPDATE USING (true);

CREATE POLICY "Public read access for FilterTemplate" ON "FilterTemplate" FOR SELECT USING (true);
CREATE POLICY "Public insert access for FilterTemplate" ON "FilterTemplate" FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for FilterTemplate" ON "FilterTemplate" FOR UPDATE USING (true);
CREATE POLICY "Public delete access for FilterTemplate" ON "FilterTemplate" FOR DELETE USING (true);

-- ============================================
-- Add distributorId to Transaction table if not exists
-- ============================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Transaction' AND column_name = 'distributorId') THEN
        ALTER TABLE "Transaction" ADD COLUMN "distributorId" TEXT;
    END IF;
END $$;

-- ============================================
-- Create Indexes for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS "idx_drug_atx_code" ON "Drug"("atxCode");
CREATE INDEX IF NOT EXISTS "idx_drug_inn" ON "Drug"("inn");
CREATE INDEX IF NOT EXISTS "idx_drug_manufacturer" ON "Drug"("manufacturer");
CREATE INDEX IF NOT EXISTS "idx_drug_country" ON "Drug"("country");
CREATE INDEX IF NOT EXISTS "idx_market_data_drug" ON "MarketData"("drugId");
CREATE INDEX IF NOT EXISTS "idx_market_data_period" ON "MarketData"("year", "quarter");
CREATE INDEX IF NOT EXISTS "idx_atx_level" ON "ATXClassification"("level");
CREATE INDEX IF NOT EXISTS "idx_atx_parent" ON "ATXClassification"("parentCode");
