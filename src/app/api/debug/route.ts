import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/debug - Debug database connection
export async function GET() {
    try {
        const { count: drugCount } = await supabase
            .from('Drug')
            .select('id', { count: 'exact', head: true })

        const { count: pharmacyCount } = await supabase
            .from('Pharmacy')
            .select('id', { count: 'exact', head: true })

        const { count: inventoryCount } = await supabase
            .from('Inventory')
            .select('id', { count: 'exact', head: true })

        return NextResponse.json({
            status: 'connected',
            counts: {
                drugs: drugCount || 0,
                pharmacies: pharmacyCount || 0,
                inventory: inventoryCount || 0,
            }
        })
    } catch (error) {
        console.error('Debug error:', error)
        return NextResponse.json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
