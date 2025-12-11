'use client'

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
  PieChart,
  Pie,
  Cell
} from 'recharts'

// Sample data for charts
const salesData = [
  { name: 'Пн', nameUz: 'Du', nameEn: 'Mon', sales: 4200000 },
  { name: 'Вт', nameUz: 'Se', nameEn: 'Tue', sales: 3800000 },
  { name: 'Ср', nameUz: 'Ch', nameEn: 'Wed', sales: 5100000 },
  { name: 'Чт', nameUz: 'Pa', nameEn: 'Thu', sales: 4700000 },
  { name: 'Пт', nameUz: 'Ju', nameEn: 'Fri', sales: 6200000 },
  { name: 'Сб', nameUz: 'Sh', nameEn: 'Sat', sales: 7500000 },
  { name: 'Вс', nameUz: 'Ya', nameEn: 'Sun', sales: 3900000 },
]

const topDrugs = [
  { name: 'Парацетамол 500мг', nameUz: 'Paratsetamol 500mg', nameEn: 'Paracetamol 500mg', sales: 1250, revenue: 18750000 },
  { name: 'Ибупрофен 400мг', nameUz: 'Ibuprofen 400mg', nameEn: 'Ibuprofen 400mg', sales: 980, revenue: 14700000 },
  { name: 'Аспирин 100мг', nameUz: 'Aspirin 100mg', nameEn: 'Aspirin 100mg', sales: 850, revenue: 8500000 },
  { name: 'Амоксициллин 500мг', nameUz: 'Amoksitsillin 500mg', nameEn: 'Amoxicillin 500mg', sales: 720, revenue: 21600000 },
  { name: 'Омепразол 20мг', nameUz: 'Omeprazol 20mg', nameEn: 'Omeprazole 20mg', sales: 650, revenue: 16250000 },
]

const recentTransactions = [
  { id: 1, type: 'SALE', drug: { ru: 'Парацетамол 500мг', uz: 'Paratsetamol 500mg', en: 'Paracetamol 500mg' }, pharmacy: { ru: 'Аптека №1', uz: 'Dorixona №1', en: 'Pharmacy #1' }, quantity: 50, amount: 750000, time: { ru: '10 мин назад', uz: '10 daqiqa oldin', en: '10 min ago' } },
  { id: 2, type: 'PURCHASE', drug: { ru: 'Ибупрофен 400мг', uz: 'Ibuprofen 400mg', en: 'Ibuprofen 400mg' }, pharmacy: { ru: 'Аптека №2', uz: 'Dorixona №2', en: 'Pharmacy #2' }, quantity: 200, amount: 2400000, time: { ru: '25 мин назад', uz: '25 daqiqa oldin', en: '25 min ago' } },
  { id: 3, type: 'SALE', drug: { ru: 'Аспирин 100мг', uz: 'Aspirin 100mg', en: 'Aspirin 100mg' }, pharmacy: { ru: 'Аптека №1', uz: 'Dorixona №1', en: 'Pharmacy #1' }, quantity: 30, amount: 300000, time: { ru: '1 час назад', uz: '1 soat oldin', en: '1 hour ago' } },
  { id: 4, type: 'SALE', drug: { ru: 'Омепразол 20мг', uz: 'Omeprazol 20mg', en: 'Omeprazole 20mg' }, pharmacy: { ru: 'Аптека №3', uz: 'Dorixona №3', en: 'Pharmacy #3' }, quantity: 20, amount: 500000, time: { ru: '2 часа назад', uz: '2 soat oldin', en: '2 hours ago' } },
]

const inventoryByPharmacy = [
  { name: { ru: 'Аптека №1', uz: 'Dorixona №1', en: 'Pharmacy #1' }, value: 45 },
  { name: { ru: 'Аптека №2', uz: 'Dorixona №2', en: 'Pharmacy #2' }, value: 30 },
  { name: { ru: 'Аптека №3', uz: 'Dorixona №3', en: 'Pharmacy #3' }, value: 25 },
]

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa']

const lowStockItems = [
  { drug: { ru: 'Аспирин 100мг', uz: 'Aspirin 100mg', en: 'Aspirin 100mg' }, pharmacy: { ru: 'Аптека №2', uz: 'Dorixona №2', en: 'Pharmacy #2' }, current: 5, min: 20 },
  { drug: { ru: 'Цефтриаксон 1г', uz: 'Seftriakson 1g', en: 'Ceftriaxone 1g' }, pharmacy: { ru: 'Аптека №1', uz: 'Dorixona №1', en: 'Pharmacy #1' }, current: 3, min: 15 },
  { drug: { ru: 'Омез 20мг', uz: 'Omez 20mg', en: 'Omez 20mg' }, pharmacy: { ru: 'Аптека №3', uz: 'Dorixona №3', en: 'Pharmacy #3' }, current: 8, min: 25 },
]

const expiringItems = [
  { drug: { ru: 'Вакцина гриппа', uz: 'Gripp vaksinasi', en: 'Flu Vaccine' }, batch: 'VG-2024-001', expiry: '15.01.2025', days: 5 },
  { drug: { ru: 'Инсулин', uz: 'Insulin', en: 'Insulin' }, batch: 'IN-2024-089', expiry: '20.01.2025', days: 10 },
  { drug: { ru: 'Антибиотик суспензия', uz: 'Antibiotik suspenziya', en: 'Antibiotic Suspension' }, batch: 'AS-2024-234', expiry: '28.01.2025', days: 18 },
]

export default function Dashboard() {
  const { t, lang } = useLanguage()
  
  function formatCurrency(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M ' + (lang === 'en' ? 'UZS' : 'сум')
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(0) + 'K ' + (lang === 'en' ? 'UZS' : 'сум')
    }
    return value.toLocaleString() + ' ' + (lang === 'en' ? 'UZS' : 'сум')
  }

  const chartData = salesData.map(d => ({
    ...d,
    displayName: lang === 'ru' ? d.name : lang === 'uz' ? d.nameUz : d.nameEn
  }))

  return (
    <>
      <Header 
        title={t('dashboard')} 
        subtitle={t('welcomeMessage')}
      />
      
      <div className="page-content">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon primary">
              <Pill size={24} />
            </div>
            <div className="stat-value">2,458</div>
            <div className="stat-label">{t('totalDrugs')}</div>
            <div className="stat-change positive">
              <TrendingUp size={14} />
              <span>+12 {t('perWeek')}</span>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon success">
              <Package size={24} />
            </div>
            <div className="stat-value">847.5M</div>
            <div className="stat-label">{t('totalInventory')} ({lang === 'en' ? 'UZS' : 'сум'})</div>
            <div className="stat-change positive">
              <TrendingUp size={14} />
              <span>+8.3% {t('perMonth')}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon primary">
              <DollarSign size={24} />
            </div>
            <div className="stat-value">35.4M</div>
            <div className="stat-label">{t('todaySales')}</div>
            <div className="stat-change positive">
              <TrendingUp size={14} />
              <span>+15.2% {t('vsYesterday')}</span>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon warning">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-value">23</div>
            <div className="stat-label">{t('lowStock')}</div>
            <div className="stat-change negative">
              <TrendingDown size={14} />
              <span>{t('needsAttention')}</span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
          {/* Sales Chart */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">{t('salesThisWeek')}</h3>
              <button className="btn btn-secondary btn-sm">
                {t('details')} <ArrowRight size={14} />
              </button>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="displayName" 
                      stroke="#64748b" 
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={12}
                      tickLine={false}
                      tickFormatter={(value) => (value / 1000000).toFixed(1) + 'M'}
                    />
                    <Tooltip 
                      contentStyle={{
                        background: '#1e1e2a',
                        border: '1px solid #2a2a3a',
                        borderRadius: '8px',
                        color: '#f8fafc'
                      }}
                      formatter={(value: number) => [formatCurrency(value), t('sales')]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#6366f1" 
                      strokeWidth={2}
                      fill="url(#salesGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Selling Drugs */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">{t('topSellingDrugs')}</h3>
              <span className="badge badge-primary">{t('today')}</span>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t('drug')}</th>
                    <th>{lang === 'ru' ? 'Продано' : lang === 'uz' ? 'Sotildi' : 'Sold'}</th>
                    <th>{t('revenue')}</th>
                  </tr>
                </thead>
                <tbody>
                  {topDrugs.map((drug, index) => (
                    <tr key={index}>
                      <td style={{ fontWeight: 500 }}>{lang === 'ru' ? drug.name : lang === 'uz' ? drug.nameUz : drug.nameEn}</td>
                      <td>{drug.sales} {t('pcs')}</td>
                      <td style={{ color: 'var(--success)' }}>{formatCurrency(drug.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
          {/* Recent Transactions */}
          <div className="card" style={{ gridColumn: 'span 2' }}>
            <div className="card-header">
              <h3 className="card-title">{t('recentTransactions')}</h3>
              <button className="btn btn-ghost btn-sm">
                {t('allOperations')} <ArrowRight size={14} />
              </button>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{lang === 'ru' ? 'Тип' : lang === 'uz' ? 'Tur' : 'Type'}</th>
                    <th>{t('drug')}</th>
                    <th>{t('pharmacy')}</th>
                    <th>{t('quantity')}</th>
                    <th>{t('totalAmount')}</th>
                    <th>{lang === 'ru' ? 'Время' : lang === 'uz' ? 'Vaqt' : 'Time'}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td>
                        <span className={`badge ${tx.type === 'SALE' ? 'badge-success' : 'badge-info'}`}>
                          {tx.type === 'SALE' ? t('sale') : t('purchase')}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{tx.drug[lang]}</td>
                      <td>{tx.pharmacy[lang]}</td>
                      <td>{tx.quantity} {t('pcs')}</td>
                      <td style={{ color: tx.type === 'SALE' ? 'var(--success)' : 'var(--info)' }}>
                        {formatCurrency(tx.amount)}
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={14} />
                          {tx.time[lang]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inventory Distribution */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">{t('inventoryDistribution')}</h3>
            </div>
            <div className="card-body">
              <div style={{ height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={inventoryByPharmacy}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {inventoryByPharmacy.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        background: '#1e1e2a',
                        border: '1px solid #2a2a3a',
                        borderRadius: '8px',
                        color: '#f8fafc'
                      }}
                      formatter={(value: number) => [`${value}%`, t('share')]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ marginTop: '1rem' }}>
                {inventoryByPharmacy.map((pharmacy, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '0.5rem 0',
                    borderBottom: index < inventoryByPharmacy.length - 1 ? '1px solid var(--border)' : 'none'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ 
                        width: '10px', 
                        height: '10px', 
                        borderRadius: '50%', 
                        background: COLORS[index] 
                      }}></span>
                      {pharmacy.name[lang]}
                    </span>
                    <span style={{ fontWeight: 600 }}>{pharmacy.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Row */}
        <div className="grid-2">
          {/* Low Stock Alert */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />
                {t('lowStockAlert')}
              </h3>
              <span className="badge badge-warning">{lowStockItems.length}</span>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t('drug')}</th>
                    <th>{t('pharmacy')}</th>
                    <th>{t('current')} / {t('min')}</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map((item, index) => (
                    <tr key={index}>
                      <td style={{ fontWeight: 500 }}>{item.drug[lang]}</td>
                      <td>{item.pharmacy[lang]}</td>
                      <td>
                        <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{item.current}</span>
                        <span style={{ color: 'var(--text-muted)' }}> / {item.min}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expiring Items */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} style={{ color: 'var(--danger)' }} />
                {t('expiryAlert')}
              </h3>
              <span className="badge badge-danger">{expiringItems.length}</span>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t('drug')}</th>
                    <th>{t('batch')}</th>
                    <th>{t('date')} / {t('days')}</th>
                  </tr>
                </thead>
                <tbody>
                  {expiringItems.map((item, index) => (
                    <tr key={index}>
                      <td style={{ fontWeight: 500 }}>{item.drug[lang]}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{item.batch}</td>
                      <td>
                        <span>{item.expiry}</span>
                        <span className={`badge ${item.days <= 7 ? 'badge-danger' : 'badge-warning'}`} style={{ marginLeft: '0.5rem' }}>
                          {item.days} {t('days')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
