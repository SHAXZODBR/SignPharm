import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// ============================================
// Core Entity Types
// ============================================

export interface Drug {
    id: string
    name: string
    nameRu?: string
    nameUz?: string
    inn?: string
    atxCode?: string
    atxLevel1?: string
    atxLevel2?: string
    atxLevel3?: string
    atxLevel4?: string
    atxLevel5?: string
    ephrmraCode?: string
    therapeuticGroup?: string
    form?: string
    dosage?: string
    activeSubstance?: string
    manufacturer?: string
    country?: string
    prescription: boolean
    barcode?: string
    registrationNum?: string
    createdAt: string
    updatedAt: string
}

export interface Pharmacy {
    id: string
    name: string
    region: string
    district?: string
    address?: string
    phone?: string
    email?: string
    manager?: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface Supplier {
    id: string
    name: string
    nameRu?: string
    country?: string
    type: string
    contact?: string
    phone?: string
    email?: string
    address?: string
    inn?: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface Distributor {
    id: string
    name: string
    nameRu?: string
    country?: string
    region?: string
    address?: string
    phone?: string
    email?: string
    inn?: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface Inventory {
    id: string
    drugId: string
    pharmacyId: string
    supplierId?: string
    quantity: number
    purchasePriceUZS: number
    salePriceUZS: number
    purchasePriceUSD?: number
    salePriceUSD?: number
    batchNumber?: string
    expiryDate?: string
    minStock: number
    maxStock?: number
    location?: string
    createdAt: string
    updatedAt: string
    // Joined data
    drug?: Drug
    pharmacy?: Pharmacy
    supplier?: Supplier
}

export interface Transaction {
    id: string
    type: string
    drugId: string
    pharmacyId: string
    supplierId?: string
    distributorId?: string
    quantity: number
    unitPriceUZS: number
    totalAmountUZS: number
    currency: string
    batchNumber?: string
    invoiceNumber?: string
    notes?: string
    createdAt: string
    // Joined data
    drug?: Drug
    pharmacy?: Pharmacy
    supplier?: Supplier
    distributor?: Distributor
}

// ============================================
// Classification Types (Drug Audit)
// ============================================

export interface ATXClassification {
    id: string
    code: string
    level: number
    name: string
    nameRu?: string
    nameUz?: string
    parentCode?: string
    children?: ATXClassification[]
}

export interface EPhMRAClassification {
    id: string
    code: string
    level: number
    name: string
    nameRu?: string
    parentCode?: string
    children?: EPhMRAClassification[]
}

export interface Country {
    id: string
    code: string
    name: string
    nameRu?: string
    nameUz?: string
    region?: string
}

// ============================================
// Market Analytics Types (Drug Audit)
// ============================================

export interface MarketData {
    id: string
    drugId: string
    distributorId?: string
    pharmacyId?: string
    period: string
    year: number
    quarter?: number
    month?: number
    quantitySold: number
    totalAmountUZS: number
    totalAmountUSD: number
    marketSharePercent?: number
    createdAt: string
    updatedAt: string
    // Joined data
    drug?: Drug
    distributor?: Distributor
    pharmacy?: Pharmacy
}

export interface ExchangeRate {
    id: string
    currency: string
    rateToUZS: number
    rateToUSD: number
    date: string
    createdAt: string
}

export interface FilterTemplate {
    id: string
    name: string
    filters: DrugAuditFilters
    userId?: string
    isDefault: boolean
    createdAt: string
    updatedAt: string
}

// ============================================
// Drug Audit Filter & Analysis Types
// ============================================

export interface DrugAuditFilters {
    // Drug filters
    drugNames?: string[]
    tradeNames?: string[]
    inns?: string[]

    // Classification filters
    atxCodes?: string[]
    atxLevel1?: string[]
    atxLevel2?: string[]
    atxLevel3?: string[]
    atxLevel4?: string[]
    atxLevel5?: string[]
    ephrmraCodes?: string[]
    therapeuticGroups?: string[]

    // Entity filters
    manufacturers?: string[]
    countries?: string[]
    distributors?: string[]
    regions?: string[]

    // Type filters
    dosageForms?: string[]
    rxOtc?: 'all' | 'rx' | 'otc'
    vatStatus?: 'all' | 'with' | 'without'

    // Date & Price filters
    dateFrom?: string
    dateTo?: string
    priceMinUSD?: number
    priceMaxUSD?: number
    priceMinUZS?: number
    priceMaxUZS?: number

    // Period filters
    year?: number
    quarter?: number
    month?: number
}

export interface MarketShareResult {
    id: string
    name: string
    nameRu?: string
    totalQuantity: number
    totalAmountUZS: number
    totalAmountUSD: number
    shareByQuantity: number
    shareByAmount: number
    count: number
    average: number
}

export interface CorrelationResult {
    dimension1: string
    dimension1Value: string
    dimension2: string
    dimension2Value: string
    count: number
    totalAmount: number
    sharePercent: number
}

export interface TopSalesResult {
    rank: number
    id: string
    name: string
    nameRu?: string
    quantity: number
    amountUSD: number
    amountUZS: number
    sharePercent: number
    trend?: 'up' | 'down' | 'stable'
}

export interface AnalyticsOverview {
    totalDrugs: number
    totalTradeNames: number
    totalINNs: number
    totalManufacturers: number
    totalCountries: number
    totalDistributors: number
    totalMarketValueUSD: number
    totalMarketValueUZS: number
    periodStart: string
    periodEnd: string
}

// ============================================
// Analysis Dimension Enum
// ============================================

export type AnalysisDimension =
    | 'drug'
    | 'tradeName'
    | 'inn'
    | 'manufacturer'
    | 'country'
    | 'distributor'
    | 'region'
    | 'atxLevel1'
    | 'atxLevel2'
    | 'atxLevel3'
    | 'dosageForm'
    | 'rxOtc'
