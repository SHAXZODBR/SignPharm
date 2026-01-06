import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/suppliers
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''
        const activeOnly = searchParams.get('activeOnly') === 'true'

        let query = supabase
            .from('Supplier')
            .select('*')
            .order('createdAt', { ascending: false })

        if (search) {
            query = query.or(`name.ilike.%${search}%,nameRu.ilike.%${search}%`)
        }

        if (activeOnly) {
            query = query.eq('isActive', true)
        }

        const { data: suppliers, error } = await query

        if (error) throw error

        return NextResponse.json(suppliers || [])
    } catch (error) {
        console.error('Error fetching suppliers:', error)
        return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 })
    }
}

// POST /api/suppliers
export async function POST(request: NextRequest) {
    try {
        const data = await request.json()

        const { data: supplier, error } = await supabase
            .from('Supplier')
            .insert({
                name: data.name,
                nameRu: data.nameRu || null,
                country: data.country || null,
                type: data.type,
                contact: data.contact || null,
                phone: data.phone || null,
                email: data.email || null,
                address: data.address || null,
                inn: data.inn || null,
                isActive: data.isActive !== false,
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(supplier, { status: 201 })
    } catch (error) {
        console.error('Error creating supplier:', error)
        return NextResponse.json({ error: 'Failed to create supplier' }, { status: 500 })
    }
}
