import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/seed - For debugging, seed sample data
export async function GET() {
    try {
        // Check if we already have data
        const { count } = await supabase
            .from('Drug')
            .select('id', { count: 'exact', head: true })

        if (count && count > 0) {
            return NextResponse.json({
                message: 'Database already has data',
                drugCount: count
            })
        }

        return NextResponse.json({
            message: 'Please run the SQL script in Supabase Dashboard to create tables and seed data',
            tables: ['Drug', 'Pharmacy', 'Supplier', 'Inventory', 'Transaction', 'AtxCategory', 'Settings']
        })
    } catch (error) {
        console.error('Seed error:', error)
        return NextResponse.json({
            error: 'Failed to check database. Make sure tables are created in Supabase.',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
