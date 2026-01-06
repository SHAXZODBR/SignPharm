import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/inventory/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { data: inventory, error } = await supabase
            .from('Inventory')
            .select('*, drug:Drug(*), pharmacy:Pharmacy(*), supplier:Supplier(*)')
            .eq('id', id)
            .single()

        if (error) throw error

        if (!inventory) {
            return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 })
        }

        return NextResponse.json(inventory)
    } catch (error) {
        console.error('Error fetching inventory item:', error)
        return NextResponse.json({ error: 'Failed to fetch inventory item' }, { status: 500 })
    }
}

// PUT /api/inventory/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const data = await request.json()

        const { data: inventory, error } = await supabase
            .from('Inventory')
            .update({
                quantity: data.quantity,
                purchasePriceUZS: data.purchasePriceUZS,
                salePriceUZS: data.salePriceUZS,
                purchasePriceUSD: data.purchasePriceUSD,
                salePriceUSD: data.salePriceUSD,
                batchNumber: data.batchNumber,
                expiryDate: data.expiryDate,
                minStock: data.minStock,
                maxStock: data.maxStock,
                location: data.location,
                updatedAt: new Date().toISOString(),
            })
            .eq('id', id)
            .select('*, drug:Drug(*), pharmacy:Pharmacy(*), supplier:Supplier(*)')
            .single()

        if (error) throw error

        return NextResponse.json(inventory)
    } catch (error) {
        console.error('Error updating inventory:', error)
        return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 })
    }
}

// DELETE /api/inventory/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { error } = await supabase
            .from('Inventory')
            .delete()
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting inventory:', error)
        return NextResponse.json({ error: 'Failed to delete inventory' }, { status: 500 })
    }
}
