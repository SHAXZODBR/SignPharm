import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/distributors - List all distributors
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search')
        const region = searchParams.get('region')

        let query = supabase
            .from('Distributor')
            .select('*')
            .order('name')

        if (search) {
            query = query.or(`name.ilike.%${search}%,nameRu.ilike.%${search}%,country.ilike.%${search}%`)
        }

        if (region) {
            query = query.eq('region', region)
        }

        const { data, error } = await query

        if (error) {
            console.error('Distributors fetch error:', error)
            // Return sample data if table doesn't exist or other error
            return NextResponse.json(getSampleDistributors())
        }

        // If no data in database, return sample data
        if (!data || data.length === 0) {
            return NextResponse.json(getSampleDistributors())
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching distributors:', error)
        return NextResponse.json(getSampleDistributors())
    }
}

// POST /api/distributors - Create new distributor
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const { data, error } = await supabase
            .from('Distributor')
            .insert({
                name: body.name,
                nameRu: body.nameRu || body.name,
                country: body.country || 'Uzbekistan',
                region: body.region,
                contact: body.contact,
                phone: body.phone,
                email: body.email,
                address: body.address,
                inn: body.inn,
                isActive: true,
            })
            .select()
            .single()

        if (error) {
            console.error('Distributor create error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        console.error('Error creating distributor:', error)
        return NextResponse.json({ error: 'Failed to create distributor' }, { status: 500 })
    }
}

function getSampleDistributors() {
    return [
        { id: '1', name: 'GRАНО ФАРМ ТРЕЙД', nameRu: 'ГРАНО ФАРМ ТРЕЙД', country: 'Узбекистан', region: 'Tashkent', type: 'WHOLESALER', contact: 'Иванов И.И.', phone: '+998 71 123-45-67', email: 'info@granopharm.uz', address: 'г. Ташкент, Мирзо-Улугбекский район', inn: '123456789', isActive: true, drugsCount: 245 },
        { id: '2', name: 'УЗМЕДИМПЕКС', nameRu: 'УЗМЕДИМПЕКС', country: 'Узбекистан', region: 'Tashkent', type: 'IMPORTER', contact: 'Петров П.П.', phone: '+998 71 234-56-78', email: 'info@uzmedimpex.uz', address: 'г. Ташкент, Яккасарайский район', inn: '234567890', isActive: true, drugsCount: 189 },
        { id: '3', name: 'МИНИЦФАРВ', nameRu: 'МИНИЦФАРВ', country: 'Узбекистан', region: 'Samarkand', type: 'REGIONAL', contact: 'Сидоров С.С.', phone: '+998 66 123-45-67', email: 'info@minitsfarm.uz', address: 'г. Самарканд, ул. Регистан', inn: '345678901', isActive: true, drugsCount: 156 },
        { id: '4', name: 'ФАРМАЦЕВТ ПЛЮС', nameRu: 'ФАРМАЦЕВТ ПЛЮС', country: 'Узбекистан', region: 'Fergana', type: 'REGIONAL', contact: 'Алиев А.А.', phone: '+998 73 345-67-89', email: 'info@pharmaplus.uz', address: "г. Фергана, ул. Навои", inn: '456789012', isActive: true, drugsCount: 98 },
        { id: '5', name: 'ДОРИВОР САВДО', nameRu: 'ДОРИВОР САВДО', country: 'Узбекистан', region: 'Bukhara', type: 'WHOLESALER', contact: 'Каримов К.К.', phone: '+998 65 234-56-78', email: 'info@dorivor.uz', address: 'г. Бухара, ул. Мустакиллик', inn: '567890123', isActive: false, drugsCount: 67 },
    ]
}
