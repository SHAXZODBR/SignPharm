import { NextRequest, NextResponse } from 'next/server'
import { supabase, Transaction } from '@/lib/supabase'

// GET /api/transactions
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type')
        const pharmacyId = searchParams.get('pharmacyId')
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        let query = supabase
            .from('Transaction')
            .select('*, drug:Drug(*), pharmacy:Pharmacy(*), supplier:Supplier(*)', { count: 'exact' })
            .order('createdAt', { ascending: false })
            .range(offset, offset + limit - 1)

        if (type) {
            query = query.eq('type', type)
        }
        if (pharmacyId) {
            query = query.eq('pharmacyId', pharmacyId)
        }

        const { data: transactions, count, error } = await query

        if (error) throw error

        return NextResponse.json({
            transactions: transactions || [],
            total: count || 0,
            limit,
            offset
        })
    } catch (error) {
        console.error('Error fetching transactions:', error)
        return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
    }
}

// POST /api/transactions
export async function POST(request: NextRequest) {
    try {
        const data = await request.json()
        const { type, drugId, pharmacyId, supplierId, quantity, unitPriceUZS, salePriceUZS, totalAmountUZS, batchNumber, invoiceNumber, notes } = data

        // Create the transaction
        const { data: transaction, error: txError } = await supabase
            .from('Transaction')
            .insert({
                type,
                drugId,
                pharmacyId,
                supplierId: supplierId || null,
                quantity,
                unitPriceUZS: unitPriceUZS || 0,
                totalAmountUZS: totalAmountUZS || 0,
                currency: 'UZS',
                batchNumber: batchNumber || null,
                invoiceNumber: invoiceNumber || null,
                notes: notes || null,
            })
            .select()
            .single()

        if (txError) throw txError

        // Update inventory for SALE transactions
        if (type === 'SALE') {
            // Find inventory item
            const { data: inventory, error: findError } = await supabase
                .from('Inventory')
                .select('id, quantity')
                .eq('drugId', drugId)
                .eq('pharmacyId', pharmacyId)
                .single()

            if (findError) {
                throw new Error('Inventory not found')
            }

            if (inventory.quantity < quantity) {
                throw new Error('Insufficient stock')
            }

            // Update inventory quantity
            const { error: updateError } = await supabase
                .from('Inventory')
                .update({
                    quantity: inventory.quantity - quantity,
                    updatedAt: new Date().toISOString()
                })
                .eq('id', inventory.id)

            if (updateError) throw updateError
        }

        return NextResponse.json(transaction)
    } catch (error) {
        console.error('Error creating transaction:', error)
        const message = error instanceof Error ? error.message : 'Failed to create transaction'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
