import { NextRequest, NextResponse } from 'next/server'
import { supabase, Inventory } from '@/lib/supabase'

// GET /api/inventory
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const pharmacyId = searchParams.get('pharmacyId')
        const drugId = searchParams.get('drugId')
        const lowStock = searchParams.get('lowStock') === 'true'
        const expiring = searchParams.get('expiring') === 'true'
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        let query = supabase
            .from('Inventory')
            .select('*, drug:Drug(*), pharmacy:Pharmacy(*), supplier:Supplier(*)', { count: 'exact' })
            .order('createdAt', { ascending: false })

        if (pharmacyId) {
            query = query.eq('pharmacyId', pharmacyId)
        }
        if (drugId) {
            query = query.eq('drugId', drugId)
        }

        const { data: allInventory, count, error } = await query

        if (error) throw error

        let filtered = (allInventory || []) as Inventory[]

        // Filter low stock items
        if (lowStock) {
            filtered = filtered.filter((item) => item.quantity <= item.minStock)
        }

        // Filter expiring items (within 90 days)
        if (expiring) {
            const ninetyDaysFromNow = new Date()
            ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90)
            filtered = filtered.filter(
                (item) => item.expiryDate && new Date(item.expiryDate) <= ninetyDaysFromNow
            )
        }

        const total = filtered.length
        const inventory = filtered.slice(offset, offset + limit)

        return NextResponse.json({ inventory, total, limit, offset })
    } catch (error) {
        console.error('Error fetching inventory:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({
            error: 'Failed to fetch inventory',
            details: message
        }, { status: 500 })
    }
}

// POST /api/inventory
export async function POST(request: NextRequest) {
    try {
        const data = await request.json()

        // Create inventory item
        const { data: inventory, error } = await supabase
            .from('Inventory')
            .insert({
                drugId: data.drugId,
                pharmacyId: data.pharmacyId,
                supplierId: data.supplierId || null,
                quantity: data.quantity || 0,
                purchasePriceUZS: data.purchasePriceUZS,
                salePriceUZS: data.salePriceUZS,
                purchasePriceUSD: data.purchasePriceUSD || null,
                salePriceUSD: data.salePriceUSD || null,
                batchNumber: data.batchNumber || null,
                expiryDate: data.expiryDate || null,
                minStock: data.minStock || 10,
                maxStock: data.maxStock || null,
                location: data.location || null,
            })
            .select('*, drug:Drug(*), pharmacy:Pharmacy(*), supplier:Supplier(*)')
            .single()

        if (error) throw error

        // Also create a PURCHASE transaction
        if (data.quantity > 0) {
            await supabase.from('Transaction').insert({
                type: 'PURCHASE',
                drugId: data.drugId,
                pharmacyId: data.pharmacyId,
                supplierId: data.supplierId || null,
                quantity: data.quantity,
                unitPriceUZS: data.purchasePriceUZS,
                totalAmountUZS: data.quantity * data.purchasePriceUZS,
                currency: 'UZS',
                batchNumber: data.batchNumber || null,
                invoiceNumber: data.invoiceNumber || null,
            })
        }

        return NextResponse.json(inventory, { status: 201 })
    } catch (error) {
        console.error('Error creating inventory:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: 'Failed to create inventory', details: message }, { status: 500 })
    }
}
