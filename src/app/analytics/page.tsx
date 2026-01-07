'use client'

import Header from '@/components/Header'
import { useLanguage } from '@/lib/LanguageContext'
import { useState, useEffect } from 'react'
import { Download, Calendar, TrendingUp, DollarSign, Package, BarChart3, ChevronDown, PieChart, Users, Globe, Pill, Layers, Table2 } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import MarketShareChart from '@/components/charts/MarketShareChart'
import TopRankingChart from '@/components/charts/TopRankingChart'

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

interface MarketShareData {
  name: string
  count: number
  shareByQuantity: number
}

interface TopSalesData {
  rank: number
  name: string
  count: number
  share: number
}

interface CorrelationData {
  dim1: string
  dim2: string
  count: number
}

type AnalyticsTab = 'overview' | 'marketShare' | 'topSales' | 'correlation'

export default function AnalyticsPage() {
  const { t, lang, formatCurrency } = useLanguage()
  const [period, setPeriod] = useState('year')
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardData | null>(null)

  // Market share state
  const [marketShareDimension, setMarketShareDimension] = useState('manufacturer')
  const [marketShareData, setMarketShareData] = useState<MarketShareData[]>([])
  const [marketShareLoading, setMarketShareLoading] = useState(false)

  // Top sales state
  const [topSalesDimension, setTopSalesDimension] = useState('manufacturer')
  const [topSalesData, setTopSalesData] = useState<TopSalesData[]>([])
  const [topSalesLoading, setTopSalesLoading] = useState(false)

  // Correlation state
  const [correlationDim1, setCorrelationDim1] = useState('manufacturer')
  const [correlationDim2, setCorrelationDim2] = useState('country')
  const [correlationData, setCorrelationData] = useState<any>(null)
  const [correlationLoading, setCorrelationLoading] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    if (activeTab === 'marketShare') {
      fetchMarketShare()
    } else if (activeTab === 'topSales') {
      fetchTopSales()
    } else if (activeTab === 'correlation') {
      fetchCorrelation()
    }
  }, [activeTab, marketShareDimension, topSalesDimension, correlationDim1, correlationDim2])

  const fetchDashboardData = async () => {
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

  const fetchMarketShare = async () => {
    setMarketShareLoading(true)
    try {
      const res = await fetch(`/api/market-share?dimension=${marketShareDimension}`)
      if (res.ok) {
        const json = await res.json()
        setMarketShareData(json.results || [])
      }
    } catch (error) {
      console.error('Error fetching market share:', error)
    } finally {
      setMarketShareLoading(false)
    }
  }

  const fetchTopSales = async () => {
    setTopSalesLoading(true)
    try {
      const res = await fetch(`/api/top-sales?dimension=${topSalesDimension}&limit=15`)
      if (res.ok) {
        const json = await res.json()
        setTopSalesData(json.results || [])
      }
    } catch (error) {
      console.error('Error fetching top sales:', error)
    } finally {
      setTopSalesLoading(false)
    }
  }

  const fetchCorrelation = async () => {
    setCorrelationLoading(true)
    try {
      const res = await fetch(`/api/correlation?dim1=${correlationDim1}&dim2=${correlationDim2}`)
      if (res.ok) {
        const json = await res.json()
        setCorrelationData(json)
      }
    } catch (error) {
      console.error('Error fetching correlation:', error)
    } finally {
      setCorrelationLoading(false)
    }
  }

  const tabs = [
    { id: 'overview' as const, label: lang === 'ru' ? 'Обзор' : lang === 'uz' ? "Ko'rish" : 'Overview', icon: BarChart3 },
    { id: 'marketShare' as const, label: lang === 'ru' ? 'Доля рынка' : lang === 'uz' ? 'Bozor ulushi' : 'Market Share', icon: PieChart },
    { id: 'topSales' as const, label: lang === 'ru' ? 'Топ продаж' : lang === 'uz' ? 'Top sotuvlar' : 'Top Sales', icon: TrendingUp },
    { id: 'correlation' as const, label: lang === 'ru' ? 'Корреляция' : lang === 'uz' ? 'Korrelyatsiya' : 'Correlation', icon: Table2 },
  ]

  const dimensions = [
    { value: 'manufacturer', label: lang === 'ru' ? 'Производитель' : lang === 'uz' ? 'Ishlab chiqaruvchi' : 'Manufacturer' },
    { value: 'country', label: lang === 'ru' ? 'Страна' : lang === 'uz' ? 'Mamlakat' : 'Country' },
    { value: 'atxCode', label: lang === 'ru' ? 'АТХ группа' : lang === 'uz' ? 'ATX guruh' : 'ATX Group' },
    { value: 'form', label: lang === 'ru' ? 'Лек. форма' : lang === 'uz' ? 'Dori shakli' : 'Dosage Form' },
    { value: 'therapeuticGroup', label: lang === 'ru' ? 'Тер. группа' : lang === 'uz' ? 'Ter. guruh' : 'Therapeutic Group' },
    { value: 'prescription', label: 'Rx/OTC' },
    { value: 'inn', label: lang === 'ru' ? 'МНН' : lang === 'uz' ? 'XNN' : 'INN' },
  ]

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

  return (
    <>
      <Header title={t('analytics')} subtitle={t('analyticsTitle')} />
      <div className="page-content">
        {/* Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div className="tabs">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary"><Calendar size={16} /> 2026 <ChevronDown size={14} /></button>
            <button className="btn btn-secondary"><Download size={16} /> {t('exportReport')}</button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
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
          </>
        )}

        {/* Market Share Tab */}
        {activeTab === 'marketShare' && (
          <>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="card-title">
                  {lang === 'ru' ? 'Доля рынка по' : lang === 'uz' ? "Bo'yicha bozor ulushi" : 'Market Share by'}
                </h3>
                <select
                  className="form-input form-select"
                  style={{ width: '200px' }}
                  value={marketShareDimension}
                  onChange={(e) => setMarketShareDimension(e.target.value)}
                >
                  {dimensions.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
              <div className="card-body">
                {marketShareLoading ? (
                  <div className="loading-container" style={{ minHeight: '300px' }}>
                    <div className="spinner"></div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <MarketShareChart
                      data={marketShareData}
                      title={lang === 'ru' ? 'Распределение' : lang === 'uz' ? 'Taqsimot' : 'Distribution'}
                      height={350}
                    />
                    <div>
                      <h4 style={{ marginBottom: '1rem', fontWeight: 600 }}>
                        {lang === 'ru' ? 'Детализация' : lang === 'uz' ? 'Tafsilot' : 'Details'}
                      </h4>
                      <div style={{ maxHeight: '350px', overflow: 'auto' }}>
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>№</th>
                              <th>{lang === 'ru' ? 'Название' : lang === 'uz' ? 'Nomi' : 'Name'}</th>
                              <th style={{ textAlign: 'right' }}>{lang === 'ru' ? 'Кол-во' : lang === 'uz' ? 'Soni' : 'Count'}</th>
                              <th style={{ textAlign: 'right' }}>{lang === 'ru' ? 'Доля %' : lang === 'uz' ? 'Ulush %' : 'Share %'}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {marketShareData.slice(0, 15).map((item, index) => (
                              <tr key={item.name}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td style={{ textAlign: 'right' }}>{item.count}</td>
                                <td style={{ textAlign: 'right', fontWeight: 600 }}>{item.shareByQuantity.toFixed(2)}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Top Sales Tab */}
        {activeTab === 'topSales' && (
          <>
            <div className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="card-title">
                  {lang === 'ru' ? 'Топ по' : lang === 'uz' ? 'Top' : 'Top by'}
                </h3>
                <select
                  className="form-input form-select"
                  style={{ width: '200px' }}
                  value={topSalesDimension}
                  onChange={(e) => setTopSalesDimension(e.target.value)}
                >
                  {dimensions.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
              <div className="card-body">
                {topSalesLoading ? (
                  <div className="loading-container" style={{ minHeight: '400px' }}>
                    <div className="spinner"></div>
                  </div>
                ) : (
                  <TopRankingChart
                    data={topSalesData}
                    height={450}
                    showRank={true}
                  />
                )}
              </div>
            </div>
          </>
        )}

        {/* Correlation Tab */}
        {activeTab === 'correlation' && (
          <>
            <div className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 className="card-title">
                  {lang === 'ru' ? 'Корреляционный анализ' : lang === 'uz' ? 'Korrelyatsiya tahlili' : 'Correlation Analysis'}
                </h3>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <select
                    className="form-input form-select"
                    style={{ width: '180px' }}
                    value={correlationDim1}
                    onChange={(e) => setCorrelationDim1(e.target.value)}
                  >
                    {dimensions.map(d => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                  <span style={{ color: 'var(--text-muted)' }}>×</span>
                  <select
                    className="form-input form-select"
                    style={{ width: '180px' }}
                    value={correlationDim2}
                    onChange={(e) => setCorrelationDim2(e.target.value)}
                  >
                    {dimensions.map(d => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="card-body">
                {correlationLoading ? (
                  <div className="loading-container" style={{ minHeight: '400px' }}>
                    <div className="spinner"></div>
                  </div>
                ) : correlationData ? (
                  <div>
                    {/* Summary stats */}
                    <div className="stats-grid" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                      <div className="stat-card">
                        <div className="stat-value">{correlationData.totalRecords}</div>
                        <div className="stat-label">{lang === 'ru' ? 'Всего записей' : 'Total Records'}</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-value">{correlationData.dim1Values?.length || 0}</div>
                        <div className="stat-label">{dimensions.find(d => d.value === correlationDim1)?.label}</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-value">{correlationData.dim2Values?.length || 0}</div>
                        <div className="stat-label">{dimensions.find(d => d.value === correlationDim2)?.label}</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-value">{correlationData.matrix?.length || 0}</div>
                        <div className="stat-label">{lang === 'ru' ? 'Комбинаций' : 'Combinations'}</div>
                      </div>
                    </div>

                    {/* Top combinations table */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div>
                        <h4 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>
                          {lang === 'ru' ? `Топ ${dimensions.find(d => d.value === correlationDim1)?.label}` : `Top ${dimensions.find(d => d.value === correlationDim1)?.label}`}
                        </h4>
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>{lang === 'ru' ? 'Название' : 'Name'}</th>
                              <th style={{ textAlign: 'right' }}>{lang === 'ru' ? 'Кол-во' : 'Count'}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {correlationData.dim1Summary?.slice(0, 10).map((item: any) => (
                              <tr key={item.name}>
                                <td>{item.name}</td>
                                <td style={{ textAlign: 'right', fontWeight: 600 }}>{item.count}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <h4 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>
                          {lang === 'ru' ? `Топ ${dimensions.find(d => d.value === correlationDim2)?.label}` : `Top ${dimensions.find(d => d.value === correlationDim2)?.label}`}
                        </h4>
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>{lang === 'ru' ? 'Название' : 'Name'}</th>
                              <th style={{ textAlign: 'right' }}>{lang === 'ru' ? 'Кол-во' : 'Count'}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {correlationData.dim2Summary?.slice(0, 10).map((item: any) => (
                              <tr key={item.name}>
                                <td>{item.name}</td>
                                <td style={{ textAlign: 'right', fontWeight: 600 }}>{item.count}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>{t('noData')}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
