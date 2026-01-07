import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/market-share - Calculate market share analytics
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const dimension = searchParams.get('dimension') || 'manufacturer' // manufacturer, country, atxCode, form
        const dateFrom = searchParams.get('dateFrom')
        const dateTo = searchParams.get('dateTo')

        // Fetch drugs data
        const { data: drugs, error } = await supabase
            .from('Drug')
            .select('*')

        if (error) {
            console.error('Error fetching drugs:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Calculate market share by dimension
        const groupedData = new Map<string, { count: number; drugs: any[] }>()

        drugs?.forEach(drug => {
            let key = ''
            switch (dimension) {
                case 'manufacturer':
                    key = drug.manufacturer || 'Unknown'
                    break
                case 'country':
                    key = drug.country || 'Unknown'
                    break
                case 'atxCode':
                    key = drug.atxCode?.substring(0, 1) || 'Unknown' // Group by first ATX level
                    break
                case 'form':
                    key = drug.form || 'Unknown'
                    break
                default:
                    key = drug.manufacturer || 'Unknown'
            }

            const existing = groupedData.get(key) || { count: 0, drugs: [] }
            existing.count++
            existing.drugs.push(drug)
            groupedData.set(key, existing)
        })

        const total = drugs?.length || 0
        const results = Array.from(groupedData.entries())
            .map(([name, data]) => ({
                id: name,
                name,
                count: data.count,
                shareByQuantity: total > 0 ? (data.count / total) * 100 : 0,
                totalQuantity: data.count,
                totalAmountUZS: 0, // Would need transaction data
                totalAmountUSD: 0,
                shareByAmount: 0,
                average: 0,
            }))
            .sort((a, b) => b.shareByQuantity - a.shareByQuantity)

        return NextResponse.json({
            dimension,
            total,
            results,
            summary: {
                totalItems: total,
                uniqueGroups: results.length,
                topGroup: results[0]?.name || null,
                topGroupShare: results[0]?.shareByQuantity || 0,
            }
        })
    } catch (error) {
        console.error('Error calculating market share:', error)
        return NextResponse.json({ error: 'Failed to calculate market share' }, { status: 500 })
    }
}
