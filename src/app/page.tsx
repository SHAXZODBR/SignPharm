'use client'

import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { useLanguage } from '@/lib/LanguageContext'
import {
  Pill,
  Package,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import Link from 'next/link'

interface DashboardStats {
  totalDrugs: number
  totalPharmacies: number
  totalSuppliers: number
  totalInventoryValue: number
  todaySalesAmount: number
  todaySalesCount: number
  lowStockCount: number
  expiringCount: number
}

interface DashboardData {
  stats: DashboardStats
  weeklySales: any[]
  topDrugs: any[]
  lowStockItems: any[]
  expiringItems: any[]
  recentTransactions: any[]
}

export default function Dashboard() {
  const { t, formatCurrency } = useLanguage()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/api/dashboard')
        if (!res.ok) throw new Error('Failed to fetch dashboard data')
        const jsonData = await res.json()
        setData(jsonData)
      } catch (err) {
        console.error(err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner">
            <div className="spinner-ring spinner-ring-1"></div>
            <div className="spinner-ring spinner-ring-2"></div>
            <div className="spinner-ring spinner-ring-3"></div>
            <div className="spinner-dot"></div>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="loading-container">
        <div className="empty-state">
          <AlertTriangle className="empty-state-icon" style={{ color: 'var(--danger)' }} />
          <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error || 'No data available'}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    )
  }

  const { stats, weeklySales, topDrugs, lowStockItems, expiringItems, recentTransactions } = data

  return (
    <>
      <Header title={t('dashboard')} subtitle={t('overview')} />
      <div className="page-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon primary">
              <Pill size={24} />
            </div>
            <div className="stat-value">{stats.totalDrugs}</div>
            <div className="stat-label">{t('totalDrugs')}</div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon warning">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-value">{stats.lowStockCount}</div>
            <div className="stat-label">{t('lowStock')}</div>
            {stats.lowStockCount > 0 && (
              <div className="stat-change negative">
                <AlertTriangle size={12} /> {t('needsAttention')}
              </div>
            )}
          </div>

          <div className="stat-card success">
            <div className="stat-icon success">
              <DollarSign size={24} />
            </div>
            <div className="stat-value">{formatCurrency(stats.todaySalesAmount)}</div>
            <div className="stat-label">{t('todaySales')}</div>
            <div className="stat-change positive">
              <TrendingUp size={12} /> +{stats.todaySalesCount} {t('today')}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon primary">
              <Package size={24} />
            </div>
            <div className="stat-value">{formatCurrency(stats.totalInventoryValue)}</div>
            <div className="stat-label">{t('totalInventory')}</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
          {/* Sales Chart */}
          <div className="card" style={{ gridColumn: 'span 1' }}>
            <div className="card-header">
              <h3 className="card-title">{t('salesThisWeek')}</h3>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklySales}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--surface)',
                        borderColor: 'var(--border)',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => [formatCurrency(value as number ?? 0), t('sales')]}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#6366f1"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorSales)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Drugs */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">{t('topSellingDrugs')}</h3>
            </div>
            <div className="card-body">
              {topDrugs.length === 0 ? (
                <div className="empty-state">
                  <Pill className="empty-state-icon" />
                  <p>No sales data yet</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {topDrugs.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: '0.875rem'
                      }}>
                        #{index + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
                          {item.drug?.name || 'Unknown'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {item.quantity} {t('pcs')}
                        </div>
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--success)' }}>
                        {formatCurrency(item.revenue)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Alerts Row */}
        <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
          {/* Low Stock */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />
                {t('lowStockAlert')}
              </h3>
              <Link href="/inventory" className="btn btn-ghost btn-sm">
                {t('viewAll')} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="card-body">
              {lowStockItems.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>All stock levels healthy</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {lowStockItems.map((item) => (
                    <div key={item.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      background: 'var(--background-tertiary)',
                      borderRadius: '10px'
                    }}>
                      <div>
                        <div style={{ fontWeight: 500 }}>{item.drug?.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.pharmacy?.name}</div>
                      </div>
                      <span className="badge badge-danger">{item.quantity} left</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Expiring Soon */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} style={{ color: 'var(--danger)' }} />
                {t('expiryAlert')}
              </h3>
              <Link href="/inventory" className="btn btn-ghost btn-sm">
                {t('viewAll')} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="card-body">
              {expiringItems.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No items expiring soon</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {expiringItems.map((item) => (
                    <div key={item.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      background: 'var(--background-tertiary)',
                      borderRadius: '10px'
                    }}>
                      <div>
                        <div style={{ fontWeight: 500 }}>{item.drug?.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Batch: {item.batchNumber}</div>
                      </div>
                      <span className="badge badge-warning">
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{t('recentTransactions')}</h3>
            <Link href="/sales" className="btn btn-ghost btn-sm">
              {t('viewAll')} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('status')}</th>
                  <th>{t('drug')}</th>
                  <th>{t('pharmacy')}</th>
                  <th>{t('quantity')}</th>
                  <th>{t('totalAmount')}</th>
                  <th>{t('date')}</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      No transactions yet
                    </td>
                  </tr>
                ) : (
                  recentTransactions.map((tx: any) => (
                    <tr key={tx.id}>
                      <td>
                        <span className={`badge ${tx.type === 'SALE' ? 'badge-success' : 'badge-info'}`}>
                          {tx.type === 'SALE' ? <TrendingUp size={12} style={{ marginRight: '4px' }} /> : <Package size={12} style={{ marginRight: '4px' }} />}
                          {tx.type === 'SALE' ? t('sale') : tx.type}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{tx.drug?.name}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{tx.pharmacy?.name}</td>
                      <td>{tx.quantity} {t('pcs')}</td>
                      <td style={{ fontWeight: 600, color: tx.type === 'SALE' ? 'var(--success)' : 'var(--text-primary)' }}>
                        {formatCurrency(tx.totalAmountUZS)}
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {new Date(tx.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
