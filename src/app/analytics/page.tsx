'use client'

import Header from '@/components/Header'
import { useLanguage } from '@/lib/LanguageContext'
import { useState } from 'react'
import { Download, Calendar, TrendingUp, DollarSign, Package, BarChart3, ChevronDown } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts'

const salesTrendData = [
  { date: { ru: 'Янв', uz: 'Yan', en: 'Jan' }, sales: 125000000, purchases: 98000000, profit: 27000000 },
  { date: { ru: 'Фев', uz: 'Fev', en: 'Feb' }, sales: 142000000, purchases: 105000000, profit: 37000000 },
  { date: { ru: 'Мар', uz: 'Mar', en: 'Mar' }, sales: 168000000, purchases: 120000000, profit: 48000000 },
  { date: { ru: 'Апр', uz: 'Apr', en: 'Apr' }, sales: 155000000, purchases: 115000000, profit: 40000000 },
  { date: { ru: 'Май', uz: 'May', en: 'May' }, sales: 178000000, purchases: 130000000, profit: 48000000 },
  { date: { ru: 'Июн', uz: 'Iyun', en: 'Jun' }, sales: 195000000, purchases: 142000000, profit: 53000000 },
  { date: { ru: 'Июл', uz: 'Iyul', en: 'Jul' }, sales: 210000000, purchases: 155000000, profit: 55000000 },
  { date: { ru: 'Авг', uz: 'Avg', en: 'Aug' }, sales: 188000000, purchases: 140000000, profit: 48000000 },
  { date: { ru: 'Сен', uz: 'Sen', en: 'Sep' }, sales: 225000000, purchases: 160000000, profit: 65000000 },
  { date: { ru: 'Окт', uz: 'Okt', en: 'Oct' }, sales: 245000000, purchases: 175000000, profit: 70000000 },
  { date: { ru: 'Ноя', uz: 'Noy', en: 'Nov' }, sales: 268000000, purchases: 185000000, profit: 83000000 },
  { date: { ru: 'Дек', uz: 'Dek', en: 'Dec' }, sales: 285000000, purchases: 195000000, profit: 90000000 },
]

const topDrugsData = [
  { name: { ru: 'Парацетамол', uz: 'Paratsetamol', en: 'Paracetamol' }, revenue: 675000000 },
  { name: { ru: 'Ибупрофен', uz: 'Ibuprofen', en: 'Ibuprofen' }, revenue: 570000000 },
  { name: { ru: 'Амоксициллин', uz: 'Amoksitsillin', en: 'Amoxicillin' }, revenue: 1200000000 },
  { name: { ru: 'Омепразол', uz: 'Omeprazol', en: 'Omeprazole' }, revenue: 660000000 },
  { name: { ru: 'Аспирин', uz: 'Aspirin', en: 'Aspirin' }, revenue: 420000000 },
  { name: { ru: 'Метформин', uz: 'Metformin', en: 'Metformin' }, revenue: 684000000 },
  { name: { ru: 'Диклофенак', uz: 'Diklofenak', en: 'Diclofenac' }, revenue: 504000000 },
  { name: { ru: 'Лоратадин', uz: 'Loratadin', en: 'Loratadine' }, revenue: 448000000 },
]

const salesByPharmacy = [
  { name: { ru: 'Аптека №1', uz: 'Dorixona №1', en: 'Pharmacy #1' }, value: 45, amount: 985000000 },
  { name: { ru: 'Аптека №2', uz: 'Dorixona №2', en: 'Pharmacy #2' }, value: 32, amount: 700000000 },
  { name: { ru: 'Аптека №3', uz: 'Dorixona №3', en: 'Pharmacy #3' }, value: 23, amount: 502000000 },
]

const salesByCategory = [
  { name: { ru: 'Анальгетики', uz: 'Analgeziklar', en: 'Analgesics' }, value: 25, amount: 548000000 },
  { name: { ru: 'Антибиотики', uz: 'Antibiotiklar', en: 'Antibiotics' }, value: 22, amount: 481000000 },
  { name: { ru: 'НПВС', uz: 'NSAID', en: 'NSAIDs' }, value: 18, amount: 394000000 },
  { name: { ru: 'ИПП', uz: 'PPI', en: 'PPIs' }, value: 12, amount: 263000000 },
  { name: { ru: 'Другие', uz: 'Boshqalar', en: 'Others' }, value: 23, amount: 501000000 },
]

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe']

export default function AnalyticsPage() {
  const { t, lang } = useLanguage()
  const [period, setPeriod] = useState('year')

  function formatCurrency(value: number): string {
    if (value >= 1000000000) return (value / 1000000000).toFixed(2) + 'B ' + (lang === 'en' ? 'UZS' : 'сум')
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M ' + (lang === 'en' ? 'UZS' : 'сум')
    return value.toLocaleString('ru-RU') + ' ' + (lang === 'en' ? 'UZS' : 'сум')
  }

  const chartData = salesTrendData.map(d => ({ ...d, displayDate: d.date[lang] }))
  const totalSales = salesTrendData.reduce((sum, d) => sum + d.sales, 0)
  const totalPurchases = salesTrendData.reduce((sum, d) => sum + d.purchases, 0)
  const totalProfit = salesTrendData.reduce((sum, d) => sum + d.profit, 0)
  const profitMargin = ((totalProfit / totalSales) * 100).toFixed(1)

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
            <button className="btn btn-secondary"><Calendar size={16} /> 2025 <ChevronDown size={14} /></button>
            <button className="btn btn-secondary"><Download size={16} /> {t('exportReport')}</button>
          </div>
        </div>

        <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="stat-card success"><div className="stat-icon success"><DollarSign size={24} /></div><div className="stat-value">{formatCurrency(totalSales)}</div><div className="stat-label">{t('totalRevenue')}</div><div className="stat-change positive"><TrendingUp size={14} /><span>+18.5% {t('vsLastYear')}</span></div></div>
          <div className="stat-card"><div className="stat-icon primary"><Package size={24} /></div><div className="stat-value">{formatCurrency(totalPurchases)}</div><div className="stat-label">{t('purchasesTotal')}</div><div className="stat-change positive"><TrendingUp size={14} /><span>+12.3% {t('vsLastYear')}</span></div></div>
          <div className="stat-card success"><div className="stat-icon success"><TrendingUp size={24} /></div><div className="stat-value">{formatCurrency(totalProfit)}</div><div className="stat-label">{t('profit')}</div><div className="stat-change positive"><TrendingUp size={14} /><span>+24.7% {t('vsLastYear')}</span></div></div>
          <div className="stat-card"><div className="stat-icon primary"><BarChart3 size={24} /></div><div className="stat-value">{profitMargin}%</div><div className="stat-label">{t('margin')}</div><div className="stat-change positive"><TrendingUp size={14} /><span>+2.1% {t('vsLastYear')}</span></div></div>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header">
            <h3 className="card-title">{t('salesAndPurchasesTrend')}</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></span>{t('sales')}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#6366f1' }}></span>{t('purchasesTotal')}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></span>{t('profit')}</span>
            </div>
          </div>
          <div className="card-body">
            <div style={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs><linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient><linearGradient id="purchasesGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="displayDate" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(v) => (v / 1000000).toFixed(0) + 'M'} />
                  <Tooltip contentStyle={{ background: '#1e1e2a', border: '1px solid #2a2a3a', borderRadius: '8px', color: '#f8fafc' }} formatter={(value: number, name: string) => [formatCurrency(value), name === 'sales' ? t('sales') : name === 'purchases' ? t('purchasesTotal') : t('profit')]} />
                  <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} fill="url(#salesGrad)" />
                  <Area type="monotone" dataKey="purchases" stroke="#6366f1" strokeWidth={2} fill="url(#purchasesGrad)" />
                  <Line type="monotone" dataKey="profit" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
          <div className="card">
            <div className="card-header"><h3 className="card-title">{t('topDrugsByRevenue')}</h3></div>
            <div className="card-body">
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topDrugsData.map(d => ({ ...d, displayName: d.name[lang] }))} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" stroke="#64748b" fontSize={12} tickFormatter={(v) => (v / 1000000).toFixed(0) + 'M'} />
                    <YAxis type="category" dataKey="displayName" stroke="#64748b" fontSize={12} width={100} />
                    <Tooltip contentStyle={{ background: '#1e1e2a', border: '1px solid #2a2a3a', borderRadius: '8px', color: '#f8fafc' }} formatter={(value: number) => [formatCurrency(value), t('revenue')]} />
                    <Bar dataKey="revenue" fill="#6366f1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h3 className="card-title">{t('salesByPharmacy')}</h3></div>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ width: '180px', height: '180px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart><Pie data={salesByPharmacy} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">{salesByPharmacy.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip contentStyle={{ background: '#1e1e2a', border: '1px solid #2a2a3a', borderRadius: '8px', color: '#f8fafc' }} /></PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ flex: 1 }}>
                  {salesByPharmacy.map((pharmacy, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: index < salesByPharmacy.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORS[index] }}></span><span>{pharmacy.name[lang]}</span></span>
                      <div style={{ textAlign: 'right' }}><div style={{ fontWeight: 600 }}>{pharmacy.value}%</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatCurrency(pharmacy.amount)}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3 className="card-title">{t('salesByCategory')}</h3></div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
              {salesByCategory.map((category, index) => (
                <div key={index} style={{ background: 'var(--background-tertiary)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: COLORS[index], margin: '0 auto 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>{category.value}%</div>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{category.name[lang]}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--success)' }}>{formatCurrency(category.amount)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
