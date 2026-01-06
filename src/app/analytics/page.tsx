'use client'

import Header from '@/components/Header'
import { useLanguage } from '@/lib/LanguageContext'
import { useState, useEffect } from 'react'
import { Download, Calendar, TrendingUp, DollarSign, Package, BarChart3, ChevronDown } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts'

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe']

interface DashboardData {
  stats: {
    totalDrugs: number
    totalPharmacies: number
    totalSuppliers: number
    totalInventoryValue: number
    todaySalesAmount: number
    todaySalesCount: number
    lowStockCount: number
    expiringCount: number
  }
  weeklySales: { name: string; sales: number }[]
  topDrugs: { drug: { name: string; nameRu?: string; nameUz?: string }; quantity: number; revenue: number }[]
}

export default function AnalyticsPage() {
  const { t, lang, formatCurrency } = useLanguage()
  const [period, setPeriod] = useState('year')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/dashboard')
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <>
        <Header title={t('analytics')} subtitle={t('analyticsTitle')} />
        <div className="page-content">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>{t('loading')}</p>
          </div>
        </div>
      </>
    )
  }

  const stats = data?.stats || {
    totalDrugs: 0,
    totalPharmacies: 0,
    totalSuppliers: 0,
    totalInventoryValue: 0,
    todaySalesAmount: 0,
    todaySalesCount: 0,
    lowStockCount: 0,
    expiringCount: 0
  }

  const weeklySales = data?.weeklySales || []
  const topDrugs = data?.topDrugs || []

  // Calculate totals from weekly data
  const totalSales = weeklySales.reduce((sum, d) => sum + d.sales, 0)
  const totalProfit = Math.round(totalSales * 0.25) // Estimated 25% margin
  const profitMargin = totalSales > 0 ? '25.0' : '0'

  return (
    <>
      <Header title={t('analytics')} subtitle={t('analyticsTitle')} />
      <div className="page-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div className="tabs">
            <button className={`tab ${period === 'week' ? 'active' : ''}`} onClick={() => setPeriod('week')}>{t('week')}</button>
            <button className={`tab ${period === 'month' ? 'active' : ''}`} onClick={() => setPeriod('month')}>{t('month')}</button>
            <button className={`tab ${period === 'quarter' ? 'active' : ''}`} onClick={() => setPeriod('quarter')}>{t('quarter')}</button>
            <button className={`tab ${period === 'year' ? 'active' : ''}`} onClick={() => setPeriod('year')}>{t('year')}</button>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary"><Calendar size={16} /> 2026 <ChevronDown size={14} /></button>
            <button className="btn btn-secondary"><Download size={16} /> {t('exportReport')}</button>
          </div>
        </div>

        <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="stat-card success">
            <div className="stat-icon success"><DollarSign size={24} /></div>
            <div className="stat-value">{formatCurrency(stats.totalInventoryValue)}</div>
            <div className="stat-label">{t('totalRevenue')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon primary"><Package size={24} /></div>
            <div className="stat-value">{stats.totalDrugs}</div>
            <div className="stat-label">{t('totalDrugs')}</div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon success"><TrendingUp size={24} /></div>
            <div className="stat-value">{formatCurrency(stats.todaySalesAmount)}</div>
            <div className="stat-label">{t('salesToday')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon primary"><BarChart3 size={24} /></div>
            <div className="stat-value">{stats.todaySalesCount}</div>
            <div className="stat-label">{t('totalOperations')}</div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header">
            <h3 className="card-title">{t('salesAndPurchasesTrend')}</h3>
          </div>
          <div className="card-body">
            <div style={{ height: '350px' }}>
              {weeklySales.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklySales}>
                    <defs>
                      <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(v) => (v / 1000000).toFixed(0) + 'M'} />
                    <Tooltip
                      contentStyle={{ background: '#1e1e2a', border: '1px solid #2a2a3a', borderRadius: '8px', color: '#f8fafc' }}
                      formatter={(value) => [formatCurrency(value as number), t('sales')]}
                    />
                    <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} fill="url(#salesGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-state">
                  <p>{t('noData')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3 className="card-title">{t('topDrugsByRevenue')}</h3></div>
          <div className="card-body">
            <div style={{ height: '300px' }}>
              {topDrugs.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topDrugs.map(d => ({
                      name: d.drug?.[lang === 'ru' ? 'nameRu' : lang === 'uz' ? 'nameUz' : 'name'] || d.drug?.name || 'Unknown',
                      revenue: d.revenue
                    }))}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" stroke="#64748b" fontSize={12} tickFormatter={(v) => (v / 1000000).toFixed(0) + 'M'} />
                    <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={12} width={120} />
                    <Tooltip
                      contentStyle={{ background: '#1e1e2a', border: '1px solid #2a2a3a', borderRadius: '8px', color: '#f8fafc' }}
                      formatter={(value) => [formatCurrency(value as number), t('revenue')]}
                    />
                    <Bar dataKey="revenue" fill="#6366f1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-state">
                  <p>{t('noData')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
