import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/drugs/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { data: drug, error } = await supabase
            .from('Drug')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error

        if (!drug) {
            return NextResponse.json({ error: 'Drug not found' }, { status: 404 })
        }

        return NextResponse.json(drug)
    } catch (error) {
        console.error('Error fetching drug:', error)
        return NextResponse.json({ error: 'Failed to fetch drug' }, { status: 500 })
    }
}

// PUT /api/drugs/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const data = await request.json()

        const { data: drug, error } = await supabase
            .from('Drug')
            .update({
                name: data.name,
                nameRu: data.nameRu,
                nameUz: data.nameUz,
                inn: data.inn,
                atxCode: data.atxCode,
                therapeuticGroup: data.therapeuticGroup,
                form: data.form,
                dosage: data.dosage,
                manufacturer: data.manufacturer,
                country: data.country,
                prescription: data.prescription,
                barcode: data.barcode,
                updatedAt: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(drug)
    } catch (error) {
        console.error('Error updating drug:', error)
        return NextResponse.json({ error: 'Failed to update drug' }, { status: 500 })
    }
}

// DELETE /api/drugs/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { error } = await supabase
            .from('Drug')
            .delete()
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting drug:', error)
        return NextResponse.json({ error: 'Failed to delete drug' }, { status: 500 })
    }
}
