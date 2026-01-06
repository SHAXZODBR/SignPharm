import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/pharmacies/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { data: pharmacy, error } = await supabase
            .from('Pharmacy')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error

        if (!pharmacy) {
            return NextResponse.json({ error: 'Pharmacy not found' }, { status: 404 })
        }

        return NextResponse.json(pharmacy)
    } catch (error) {
        console.error('Error fetching pharmacy:', error)
        return NextResponse.json({ error: 'Failed to fetch pharmacy' }, { status: 500 })
    }
}

// PUT /api/pharmacies/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const data = await request.json()

        const { data: pharmacy, error } = await supabase
            .from('Pharmacy')
            .update({
                name: data.name || data.nameEn,
                region: data.region,
                district: data.district,
                address: data.address,
                phone: data.phone,
                email: data.email,
                manager: data.manager,
                isActive: data.isActive,
                updatedAt: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(pharmacy)
    } catch (error) {
        console.error('Error updating pharmacy:', error)
        return NextResponse.json({ error: 'Failed to update pharmacy' }, { status: 500 })
    }
}

// DELETE /api/pharmacies/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { error } = await supabase
            .from('Pharmacy')
            .delete()
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting pharmacy:', error)
        return NextResponse.json({ error: 'Failed to delete pharmacy' }, { status: 500 })
    }
}
