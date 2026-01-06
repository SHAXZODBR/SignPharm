import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/suppliers/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { data: supplier, error } = await supabase
            .from('Supplier')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error

        if (!supplier) {
            return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
        }

        return NextResponse.json(supplier)
    } catch (error) {
        console.error('Error fetching supplier:', error)
        return NextResponse.json({ error: 'Failed to fetch supplier' }, { status: 500 })
    }
}

// PUT /api/suppliers/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const data = await request.json()

        const { data: supplier, error } = await supabase
            .from('Supplier')
            .update({
                name: data.name,
                nameRu: data.nameRu,
                country: data.country,
                type: data.type,
                contact: data.contact,
                phone: data.phone,
                email: data.email,
                address: data.address,
                inn: data.inn,
                isActive: data.isActive,
                updatedAt: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(supplier)
    } catch (error) {
        console.error('Error updating supplier:', error)
        return NextResponse.json({ error: 'Failed to update supplier' }, { status: 500 })
    }
}

// DELETE /api/suppliers/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { error } = await supabase
            .from('Supplier')
            .delete()
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting supplier:', error)
        return NextResponse.json({ error: 'Failed to delete supplier' }, { status: 500 })
    }
}
