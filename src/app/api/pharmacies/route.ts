import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/pharmacies
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''
        const activeOnly = searchParams.get('activeOnly') === 'true'

        let query = supabase
            .from('Pharmacy')
            .select('*')
            .order('createdAt', { ascending: false })

        if (search) {
            query = query.or(`name.ilike.%${search}%,region.ilike.%${search}%`)
        }

        if (activeOnly) {
            query = query.eq('isActive', true)
        }

        const { data: pharmacies, error } = await query

        if (error) throw error

        return NextResponse.json(pharmacies || [])
    } catch (error) {
        console.error('Error fetching pharmacies:', error)
        return NextResponse.json({ error: 'Failed to fetch pharmacies' }, { status: 500 })
    }
}

// POST /api/pharmacies
export async function POST(request: NextRequest) {
    try {
        const data = await request.json()

        const { data: pharmacy, error } = await supabase
            .from('Pharmacy')
            .insert({
                name: data.name || data.nameEn || '',
                region: data.region,
                district: data.district || null,
                address: data.address || null,
                phone: data.phone || null,
                email: data.email || null,
                manager: data.manager || null,
                isActive: data.isActive !== false,
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(pharmacy, { status: 201 })
    } catch (error) {
        console.error('Error creating pharmacy:', error)
        return NextResponse.json({ error: 'Failed to create pharmacy' }, { status: 500 })
    }
}
