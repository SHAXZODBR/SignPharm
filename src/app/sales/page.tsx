'use client'

import Header from '@/components/Header'
import { useLanguage } from '@/lib/LanguageContext'
import { useState } from 'react'
import { Plus, Search, ShoppingCart, Download, Calendar, ArrowUpRight, ArrowDownLeft, Clock, ChevronDown } from 'lucide-react'

const transactionsData = [
  { id: '1', type: 'SALE', drug: { ru: 'Парацетамол 500мг', uz: 'Paratsetamol 500mg', en: 'Paracetamol 500mg' }, pharmacy: { ru: 'Аптека №1', uz: 'Dorixona №1', en: 'Pharmacy #1' }, quantity: 50, unitPrice: 15000, total: 750000, date: '2025-12-11T10:30:00', invoice: 'INV-001234' },
  { id: '2', type: 'PURCHASE', drug: { ru: 'Ибупрофен 400мг', uz: 'Ibuprofen 400mg', en: 'Ibuprofen 400mg' }, pharmacy: { ru: 'Аптека №2', uz: 'Dorixona №2', en: 'Pharmacy #2' }, quantity: 200, unitPrice: 18000, total: 3600000, date: '2025-12-11T09:45:00', invoice: 'PO-005678' },
  { id: '3', type: 'SALE', drug: { ru: 'Аспирин 100мг', uz: 'Aspirin 100mg', en: 'Aspirin 100mg' }, pharmacy: { ru: 'Аптека №1', uz: 'Dorixona №1', en: 'Pharmacy #1' }, quantity: 30, unitPrice: 12000, total: 360000, date: '2025-12-11T09:15:00', invoice: 'INV-001233' },
  { id: '4', type: 'SALE', drug: { ru: 'Омепразол 20мг', uz: 'Omeprazol 20mg', en: 'Omeprazole 20mg' }, pharmacy: { ru: 'Аптека №3', uz: 'Dorixona №3', en: 'Pharmacy #3' }, quantity: 20, unitPrice: 30000, total: 600000, date: '2025-12-11T08:50:00', invoice: 'INV-001232' },
  { id: '5', type: 'RETURN', drug: { ru: 'Амоксициллин 500мг', uz: 'Amoksitsillin 500mg', en: 'Amoxicillin 500mg' }, pharmacy: { ru: 'Аптека №2', uz: 'Dorixona №2', en: 'Pharmacy #2' }, quantity: 5, unitPrice: 48000, total: -240000, date: '2025-12-10T17:30:00', invoice: 'RET-000045' },
  { id: '6', type: 'SALE', drug: { ru: 'Метформин 850мг', uz: 'Metformin 850mg', en: 'Metformin 850mg' }, pharmacy: { ru: 'Аптека №1', uz: 'Dorixona №1', en: 'Pharmacy #1' }, quantity: 40, unitPrice: 38000, total: 1520000, date: '2025-12-10T16:20:00', invoice: 'INV-001231' },
  { id: '7', type: 'PURCHASE', drug: { ru: 'Цефтриаксон 1г', uz: 'Seftriakson 1g', en: 'Ceftriaxone 1g' }, pharmacy: { ru: 'Аптека №2', uz: 'Dorixona №2', en: 'Pharmacy #2' }, quantity: 100, unitPrice: 45000, total: 4500000, date: '2025-12-10T14:00:00', invoice: 'PO-005677' },
  { id: '8', type: 'SALE', drug: { ru: 'Лоратадин 10мг', uz: 'Loratadin 10mg', en: 'Loratadine 10mg' }, pharmacy: { ru: 'Аптека №3', uz: 'Dorixona №3', en: 'Pharmacy #3' }, quantity: 25, unitPrice: 14000, total: 350000, date: '2025-12-10T11:45:00', invoice: 'INV-001230' },
]

export default function SalesPage() {
  const { t, lang } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('')

  const transactionTypes = [
    { value: '', label: t('allOperationsType') },
    { value: 'SALE', label: t('sale') },
    { value: 'PURCHASE', label: t('purchase') },
    { value: 'RETURN', label: t('return') },
  ]

  const typeLabels: Record<string, string> = { SALE: t('sale'), PURCHASE: t('purchase'), RETURN: t('return') }
  const typeBadges: Record<string, string> = { SALE: 'badge-success', PURCHASE: 'badge-info', RETURN: 'badge-warning' }
  const typeIcons: Record<string, typeof ArrowUpRight> = { SALE: ArrowUpRight, PURCHASE: ArrowDownLeft, RETURN: ArrowDownLeft }

  const filteredTransactions = transactionsData.filter(tx => {
    const matchesSearch = tx.drug[lang].toLowerCase().includes(searchQuery.toLowerCase()) || tx.invoice.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = !selectedType || tx.type === selectedType
    return matchesSearch && matchesType
  })

  const todaySales = transactionsData.filter(tx => tx.type === 'SALE' && new Date(tx.date).toDateString() === new Date().toDateString()).reduce((sum, tx) => sum + tx.total, 0)
  const todayPurchases = transactionsData.filter(tx => tx.type === 'PURCHASE' && new Date(tx.date).toDateString() === new Date().toDateString()).reduce((sum, tx) => sum + tx.total, 0)

  function formatCurrency(value: number): string {
    const absValue = Math.abs(value)
    if (absValue >= 1000000) return (value / 1000000).toFixed(2) + 'M ' + (lang === 'en' ? 'UZS' : 'сум')
    return value.toLocaleString('ru-RU') + ' ' + (lang === 'en' ? 'UZS' : 'сум')
  }

  function formatDateTime(date: string): string { return new Date(date).toLocaleString(lang === 'en' ? 'en-GB' : 'ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }

  function getRelativeTime(date: string): string {
    const now = new Date()
    const d = new Date(date)
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffMins < 60) return `${diffMins} ${t('minAgo')}`
    if (diffHours < 24) return `${diffHours} ${t('hoursAgo')}`
    return `${diffDays} ${t('daysAgo')}`
  }

  return (
    <>
      <Header title={t('salesAndOperations')} subtitle={t('transactionHistory')} />
      <div className="page-content">
        <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="stat-card success"><div className="stat-icon success"><ArrowUpRight size={24} /></div><div className="stat-value">{formatCurrency(todaySales)}</div><div className="stat-label">{t('salesToday')}</div></div>
          <div className="stat-card"><div className="stat-icon primary"><ArrowDownLeft size={24} /></div><div className="stat-value">{formatCurrency(todayPurchases)}</div><div className="stat-label">{t('purchasesToday')}</div></div>
          <div className="stat-card"><div className="stat-icon primary"><ShoppingCart size={24} /></div><div className="stat-value">{transactionsData.filter(t => t.type === 'SALE').length}</div><div className="stat-label">{lang === 'ru' ? 'Продаж сегодня' : lang === 'uz' ? 'Bugungi sotuvlar' : "Today's Sales"}</div></div>
          <div className="stat-card"><div className="stat-icon primary"><Clock size={24} /></div><div className="stat-value">{transactionsData.length}</div><div className="stat-label">{t('totalOperations')}</div></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div className="search-input" style={{ width: '280px' }}><Search className="search-input-icon" /><input type="text" className="form-input" placeholder={t('search')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ paddingLeft: '2.75rem' }} /></div>
            <select className="form-input form-select" style={{ width: '180px' }} value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>{transactionTypes.map(type => (<option key={type.value} value={type.value}>{type.label}</option>))}</select>
            <button className="btn btn-secondary"><Calendar size={16} /> {t('today')} <ChevronDown size={14} /></button>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary"><Download size={16} /> {t('export')}</button>
            <button className="btn btn-primary"><Plus size={16} /> {t('newSale')}</button>
          </div>
        </div>

        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead><tr><th>{lang === 'ru' ? 'Тип' : lang === 'uz' ? 'Tur' : 'Type'}</th><th>{t('document')}</th><th>{t('drug')}</th><th>{t('pharmacy')}</th><th>{t('quantity')}</th><th>{t('unitPrice')}</th><th>{t('totalAmount')}</th><th>{t('dateTime')}</th></tr></thead>
              <tbody>
                {filteredTransactions.map(tx => {
                  const Icon = typeIcons[tx.type] || ArrowUpRight
                  return (
                    <tr key={tx.id}>
                      <td><span className={`badge ${typeBadges[tx.type]}`}><Icon size={12} style={{ marginRight: '4px' }} />{typeLabels[tx.type]}</span></td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{tx.invoice}</td>
                      <td style={{ fontWeight: 500 }}>{tx.drug[lang]}</td>
                      <td>{tx.pharmacy[lang]}</td>
                      <td>{tx.quantity} {t('pcs')}</td>
                      <td>{tx.unitPrice.toLocaleString()} {lang === 'en' ? 'UZS' : 'сум'}</td>
                      <td style={{ fontWeight: 600, color: tx.total >= 0 ? 'var(--success)' : 'var(--danger)' }}>{tx.total >= 0 ? '+' : ''}{formatCurrency(tx.total)}</td>
                      <td><div><div style={{ fontSize: '0.85rem' }}>{formatDateTime(tx.date)}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{getRelativeTime(tx.date)}</div></div></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
