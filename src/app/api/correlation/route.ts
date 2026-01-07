import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/correlation - Get correlation analysis between dimensions
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const dimension1 = searchParams.get('dim1') || 'manufacturer'
        const dimension2 = searchParams.get('dim2') || 'country'

        // Fetch drugs data
        const { data: drugs, error } = await supabase
            .from('Drug')
            .select('*')

        if (error) {
            console.error('Error fetching drugs:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Build correlation matrix
        const dim1Values = new Set<string>()
        const dim2Values = new Set<string>()
        const correlationMap = new Map<string, number>()

        drugs?.forEach(drug => {
            const val1 = getDimensionValue(drug, dimension1)
            const val2 = getDimensionValue(drug, dimension2)

            dim1Values.add(val1)
            dim2Values.add(val2)

            const key = `${val1}|||${val2}`
            correlationMap.set(key, (correlationMap.get(key) || 0) + 1)
        })

        // Build matrix
        const matrix: { dim1: string; dim2: string; count: number }[] = []
        dim1Values.forEach(v1 => {
            dim2Values.forEach(v2 => {
                const count = correlationMap.get(`${v1}|||${v2}`) || 0
                if (count > 0) {
                    matrix.push({ dim1: v1, dim2: v2, count })
                }
            })
        })

        // Summary statistics
        const dim1Totals = new Map<string, number>()
        const dim2Totals = new Map<string, number>()

        matrix.forEach(({ dim1, dim2, count }) => {
            dim1Totals.set(dim1, (dim1Totals.get(dim1) || 0) + count)
            dim2Totals.set(dim2, (dim2Totals.get(dim2) || 0) + count)
        })

        return NextResponse.json({
            dimension1,
            dimension2,
            dim1Values: Array.from(dim1Values).sort(),
            dim2Values: Array.from(dim2Values).sort(),
            matrix,
            dim1Summary: Array.from(dim1Totals.entries())
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count),
            dim2Summary: Array.from(dim2Totals.entries())
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count),
            totalRecords: drugs?.length || 0,
        })
    } catch (error) {
        console.error('Error calculating correlation:', error)
        return NextResponse.json({ error: 'Failed to calculate correlation' }, { status: 500 })
    }
}

function getDimensionValue(drug: any, dimension: string): string {
    switch (dimension) {
        case 'manufacturer':
            return drug.manufacturer || 'Unknown'
        case 'country':
            return drug.country || 'Unknown'
        case 'atxCode':
            return drug.atxCode?.substring(0, 1) || 'Unknown'
        case 'atxLevel2':
            return drug.atxCode?.substring(0, 3) || 'Unknown'
        case 'form':
            return drug.form || 'Unknown'
        case 'therapeuticGroup':
            return drug.therapeuticGroup || 'Unknown'
        case 'prescription':
            return drug.prescription ? 'Rx' : 'OTC'
        case 'inn':
            return drug.inn || 'Unknown'
        default:
            return 'Unknown'
    }
}
