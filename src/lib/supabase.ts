import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Type definitions for database tables
export interface Drug {
    id: string
    name: string
    nameRu?: string
    nameUz?: string
    inn?: string
    atxCode?: string
    therapeuticGroup?: string
    form?: string
    dosage?: string
    manufacturer?: string
    country?: string
    prescription: boolean
    barcode?: string
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
}
