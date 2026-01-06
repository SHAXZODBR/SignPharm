import { NextResponse } from 'next/server'
import { supabase, Inventory, Transaction } from '@/lib/supabase'

// GET /api/dashboard - Aggregated stats for dashboard
export async function GET() {
    try {
        const now = new Date()
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - 7)
        const ninetyDaysFromNow = new Date()
        ninetyDaysFromNow.setDate(now.getDate() + 90)

        // Get all data in parallel
        const [
            drugsResult,
            pharmaciesResult,
            suppliersResult,
            inventoryResult,
            todaySalesResult,
            weeklyTransactionsResult,
            recentTransactionsResult,
        ] = await Promise.all([
            supabase.from('Drug').select('id', { count: 'exact', head: true }),
            supabase.from('Pharmacy').select('id', { count: 'exact', head: true }).eq('isActive', true),
            supabase.from('Supplier').select('id', { count: 'exact', head: true }).eq('isActive', true),
            supabase.from('Inventory').select('*, drug:Drug(*), pharmacy:Pharmacy(*)'),
            supabase.from('Transaction')
                .select('totalAmountUZS')
                .eq('type', 'SALE')
                .gte('createdAt', todayStart.toISOString()),
            supabase.from('Transaction')
                .select('*, drug:Drug(*), pharmacy:Pharmacy(*)')
                .gte('createdAt', weekStart.toISOString())
                .order('createdAt', { ascending: false }),
            supabase.from('Transaction')
                .select('*, drug:Drug(*), pharmacy:Pharmacy(*), supplier:Supplier(*)')
                .order('createdAt', { ascending: false })
                .limit(10),
        ])

        const totalDrugs = drugsResult.count || 0
        const totalPharmacies = pharmaciesResult.count || 0
        const totalSuppliers = suppliersResult.count || 0
        const inventoryItems = (inventoryResult.data || []) as Inventory[]
        const todaySalesData = todaySalesResult.data || []
        const weeklyTransactions = (weeklyTransactionsResult.data || []) as Transaction[]
        const recentTransactions = (recentTransactionsResult.data || []) as Transaction[]

        // Calculate today's sales
        const todaySalesAmount = todaySalesData.reduce((sum, t) => sum + (t.totalAmountUZS || 0), 0)
        const todaySalesCount = todaySalesData.length

        // Calculate stats from inventory
        const lowStockItems = inventoryItems.filter((item) => item.quantity <= item.minStock)
        const expiringItems = inventoryItems.filter(
            (item) => item.expiryDate && new Date(item.expiryDate) <= ninetyDaysFromNow
        )
        const totalInventoryValue = inventoryItems.reduce(
            (sum, item) => sum + item.quantity * item.salePriceUZS,
            0
        )

        // Calculate weekly sales by day
        const salesByDay: { [key: string]: number } = {}
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

        weeklyTransactions
            .filter((t) => t.type === 'SALE')
            .forEach((t) => {
                const day = dayNames[new Date(t.createdAt).getDay()]
                salesByDay[day] = (salesByDay[day] || 0) + t.totalAmountUZS
            })

        const weeklySales = dayNames.map((day) => ({
            name: day,
            sales: salesByDay[day] || 0,
        }))

        // Top selling drugs
        const drugSales: { [key: string]: { drug: unknown; quantity: number; revenue: number } } = {}
        weeklyTransactions
            .filter((t) => t.type === 'SALE')
            .forEach((t) => {
                if (!drugSales[t.drugId]) {
                    drugSales[t.drugId] = { drug: t.drug, quantity: 0, revenue: 0 }
                }
                drugSales[t.drugId].quantity += t.quantity
                drugSales[t.drugId].revenue += t.totalAmountUZS
            })

        const topDrugs = Object.values(drugSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5)

        return NextResponse.json({
            stats: {
                totalDrugs,
                totalPharmacies,
                totalSuppliers,
                totalInventoryValue,
                todaySalesAmount,
                todaySalesCount,
                lowStockCount: lowStockItems.length,
                expiringCount: expiringItems.length,
            },
            weeklySales,
            topDrugs,
            lowStockItems: lowStockItems.slice(0, 5),
            expiringItems: expiringItems.slice(0, 5),
            recentTransactions,
        })
    } catch (error) {
        console.error('Error fetching dashboard data:', error)
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
    }
}
