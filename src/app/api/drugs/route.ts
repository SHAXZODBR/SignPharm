import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/drugs
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        let query = supabase
            .from('Drug')
            .select('*', { count: 'exact' })
            .order('createdAt', { ascending: false })
            .range(offset, offset + limit - 1)

        if (search) {
            query = query.or(`name.ilike.%${search}%,nameRu.ilike.%${search}%,nameUz.ilike.%${search}%`)
        }

        const { data: drugs, count, error } = await query

        if (error) throw error

        return NextResponse.json({ drugs: drugs || [], total: count || 0, limit, offset })
    } catch (error) {
        console.error('Error fetching drugs:', error)
        return NextResponse.json({ error: 'Failed to fetch drugs' }, { status: 500 })
    }
}

// POST /api/drugs
export async function POST(request: NextRequest) {
    try {
        const data = await request.json()

        const { data: drug, error } = await supabase
            .from('Drug')
            .insert({
                name: data.name,
                nameRu: data.nameRu || null,
                nameUz: data.nameUz || null,
                inn: data.inn || null,
                atxCode: data.atxCode || null,
                therapeuticGroup: data.therapeuticGroup || null,
                form: data.form || null,
                dosage: data.dosage || null,
                manufacturer: data.manufacturer || null,
                country: data.country || null,
                prescription: data.prescription || false,
                barcode: data.barcode || null,
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(drug, { status: 201 })
    } catch (error) {
        console.error('Error creating drug:', error)
        return NextResponse.json({ error: 'Failed to create drug' }, { status: 500 })
    }
}
