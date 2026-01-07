import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/distributors/[id] - Get single distributor
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { data, error } = await supabase
            .from('Distributor')
            .select('*')
            .eq('id', params.id)
            .single()

        if (error || !data) {
            return NextResponse.json({ error: 'Distributor not found' }, { status: 404 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching distributor:', error)
        return NextResponse.json({ error: 'Failed to fetch distributor' }, { status: 500 })
    }
}

// PUT /api/distributors/[id] - Update distributor
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json()

        const { data, error } = await supabase
            .from('Distributor')
            .update({
                name: body.name,
                nameRu: body.nameRu,
                country: body.country,
                region: body.region,
                contact: body.contact,
                phone: body.phone,
                email: body.email,
                address: body.address,
                inn: body.inn,
                isActive: body.isActive,
            })
            .eq('id', params.id)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error updating distributor:', error)
        return NextResponse.json({ error: 'Failed to update distributor' }, { status: 500 })
    }
}

// DELETE /api/distributors/[id] - Delete distributor
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { error } = await supabase
            .from('Distributor')
            .delete()
            .eq('id', params.id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting distributor:', error)
        return NextResponse.json({ error: 'Failed to delete distributor' }, { status: 500 })
    }
}
