import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/top-sales - Get top rankings by various dimensions
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const dimension = searchParams.get('dimension') || 'drug' // drug, manufacturer, tradeName, inn, country
        const limit = parseInt(searchParams.get('limit') || '10')
        const sortBy = searchParams.get('sortBy') || 'count' // count, amount

        // Fetch drugs data
        const { data: drugs, error } = await supabase
            .from('Drug')
            .select('*')

        if (error) {
            console.error('Error fetching drugs:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Group by dimension
        const grouped = new Map<string, { count: number; items: any[] }>()

        drugs?.forEach(drug => {
            let key = ''
            switch (dimension) {
                case 'drug':
                    key = drug.name
                    break
                case 'manufacturer':
                    key = drug.manufacturer || 'Unknown'
                    break
                case 'tradeName':
                    key = drug.nameRu || drug.name
                    break
                case 'inn':
                    key = drug.inn || 'Unknown'
                    break
                case 'country':
                    key = drug.country || 'Unknown'
                    break
                case 'atxGroup':
                    key = drug.atxCode?.substring(0, 1) || 'Unknown'
                    break
                case 'form':
                    key = drug.form || 'Unknown'
                    break
                default:
                    key = drug.name
            }

            const existing = grouped.get(key) || { count: 0, items: [] }
            existing.count++
            existing.items.push(drug)
            grouped.set(key, existing)
        })

        // Sort and limit
        const results = Array.from(grouped.entries())
            .map(([name, data], index) => ({
                rank: index + 1,
                name,
                count: data.count,
                share: drugs?.length ? (data.count / drugs.length) * 100 : 0,
                // Add representative item details
                representative: data.items[0],
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit)
            .map((item, index) => ({ ...item, rank: index + 1 }))

        return NextResponse.json({
            dimension,
            limit,
            sortBy,
            totalItems: drugs?.length || 0,
            totalGroups: grouped.size,
            results,
        })
    } catch (error) {
        console.error('Error calculating top sales:', error)
        return NextResponse.json({ error: 'Failed to calculate top sales' }, { status: 500 })
    }
}
