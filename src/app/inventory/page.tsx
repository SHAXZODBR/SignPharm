'use client'

import Header from '@/components/Header'
import { useLanguage } from '@/lib/LanguageContext'
import { useState } from 'react'
import { 
  Plus, 
  Search, 
  AlertTriangle,
  Package,
  ArrowLeftRight,
  Clock,
  Edit,
  Trash2
} from 'lucide-react'

// Sample inventory data with translations
const inventoryData = [
  { id: '1', drug: { ru: 'Парацетамол 500мг', uz: 'Paratsetamol 500mg', en: 'Paracetamol 500mg' }, pharmacy: { ru: 'Аптека №1', uz: 'Dorixona №1', en: 'Pharmacy #1' }, supplier: 'Uzpharma', quantity: 350, minStock: 50, purchasePrice: 12000, salePrice: 15000, batch: 'PAR-2024-001', expiry: '2026-03-15' },
  { id: '2', drug: { ru: 'Ибупрофен 400мг', uz: 'Ibuprofen 400mg', en: 'Ibuprofen 400mg' }, pharmacy: { ru: 'Аптека №1', uz: 'Dorixona №1', en: 'Pharmacy #1' }, supplier: 'Nobel Pharma', quantity: 180, minStock: 30, purchasePrice: 18000, salePrice: 25000, batch: 'IBU-2024-089', expiry: '2025-12-20' },
  { id: '3', drug: { ru: 'Амоксициллин 500мг', uz: 'Amoksitsillin 500mg', en: 'Amoxicillin 500mg' }, pharmacy: { ru: 'Аптека №2', uz: 'Dorixona №2', en: 'Pharmacy #2' }, supplier: 'Sandoz', quantity: 45, minStock: 40, purchasePrice: 35000, salePrice: 48000, batch: 'AMX-2024-234', expiry: '2025-08-10' },
  { id: '4', drug: { ru: 'Омепразол 20мг', uz: 'Omeprazol 20mg', en: 'Omeprazole 20mg' }, pharmacy: { ru: 'Аптека №1', uz: 'Dorixona №1', en: 'Pharmacy #1' }, supplier: "Dr. Reddy's", quantity: 220, minStock: 25, purchasePrice: 22000, salePrice: 30000, batch: 'OMP-2024-112', expiry: '2026-06-01' },
  { id: '5', drug: { ru: 'Аспирин 100мг', uz: 'Aspirin 100mg', en: 'Aspirin 100mg' }, pharmacy: { ru: 'Аптека №3', uz: 'Dorixona №3', en: 'Pharmacy #3' }, supplier: 'Bayer', quantity: 8, minStock: 20, purchasePrice: 8000, salePrice: 12000, batch: 'ASP-2024-056', expiry: '2025-02-28' },
  { id: '6', drug: { ru: 'Цефтриаксон 1г', uz: 'Seftriakson 1g', en: 'Ceftriaxone 1g' }, pharmacy: { ru: 'Аптека №2', uz: 'Dorixona №2', en: 'Pharmacy #2' }, supplier: 'Биоком', quantity: 3, minStock: 15, purchasePrice: 45000, salePrice: 62000, batch: 'CEF-2024-178', expiry: '2025-04-15' },
  { id: '7', drug: { ru: 'Метформин 850мг', uz: 'Metformin 850mg', en: 'Metformin 850mg' }, pharmacy: { ru: 'Аптека №1', uz: 'Dorixona №1', en: 'Pharmacy #1' }, supplier: 'Merck', quantity: 150, minStock: 30, purchasePrice: 28000, salePrice: 38000, batch: 'MET-2024-301', expiry: '2026-09-20' },
  { id: '8', drug: { ru: 'Лоратадин 10мг', uz: 'Loratadin 10mg', en: 'Loratadine 10mg' }, pharmacy: { ru: 'Аптека №3', uz: 'Dorixona №3', en: 'Pharmacy #3' }, supplier: 'Uzpharma', quantity: 95, minStock: 20, purchasePrice: 9000, salePrice: 14000, batch: 'LOR-2024-445', expiry: '2026-01-10' },
]

function getExpiryDays(expiry: string) {
  const expiryDate = new Date(expiry)
  const today = new Date()
  const diffTime = expiryDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export default function InventoryPage() {
  const { t, lang } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPharmacy, setSelectedPharmacy] = useState('')
  const [showLowStock, setShowLowStock] = useState(false)
  const [showExpiring, setShowExpiring] = useState(false)

  const pharmacies = [t('allPharmacies'), ...new Set(inventoryData.map(i => i.pharmacy[lang]))]

  const filteredInventory = inventoryData.filter(item => {
    const matchesSearch = item.drug[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.batch.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPharmacy = !selectedPharmacy || selectedPharmacy === t('allPharmacies') || item.pharmacy[lang] === selectedPharmacy
    const matchesLowStock = !showLowStock || item.quantity <= item.minStock
    const matchesExpiring = !showExpiring || getExpiryDays(item.expiry) <= 90
    return matchesSearch && matchesPharmacy && matchesLowStock && matchesExpiring
  })

  const lowStockCount = inventoryData.filter(i => i.quantity <= i.minStock).length
  const expiringCount = inventoryData.filter(i => getExpiryDays(i.expiry) <= 90).length
  const totalValue = inventoryData.reduce((sum, i) => sum + (i.quantity * i.salePrice), 0)

  function getStockStatus(quantity: number, minStock: number) {
    if (quantity <= 0) return { label: lang === 'ru' ? 'Нет в наличии' : lang === 'uz' ? 'Mavjud emas' : 'Out of stock', class: 'badge-danger' }
    if (quantity <= minStock * 0.5) return { label: t('critical'), class: 'badge-danger' }
    if (quantity <= minStock) return { label: t('low'), class: 'badge-warning' }
    return { label: t('normal'), class: 'badge-success' }
  }

  function formatCurrency(value: number): string {
    return value.toLocaleString('ru-RU') + (lang === 'en' ? ' UZS' : ' сум')
  }

  return (
    <>
      <Header 
        title={t('inventory')} 
        subtitle={t('inventoryManagement')}
      />
      
      <div className="page-content">
        {/* Quick Stats */}
        <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="stat-card">
            <div className="stat-icon primary"><Package size={24} /></div>
            <div className="stat-value">{inventoryData.length}</div>
            <div className="stat-label">{t('positionsOnStock')}</div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon success"><Package size={24} /></div>
            <div className="stat-value">{(totalValue / 1000000).toFixed(1)}M</div>
            <div className="stat-label">{t('totalCost')} ({lang === 'en' ? 'UZS' : 'сум'})</div>
          </div>
          <div className="stat-card warning" onClick={() => setShowLowStock(!showLowStock)} style={{ cursor: 'pointer' }}>
            <div className="stat-icon warning"><AlertTriangle size={24} /></div>
            <div className="stat-value">{lowStockCount}</div>
            <div className="stat-label">{t('lowStock')}</div>
          </div>
          <div className="stat-card danger" onClick={() => setShowExpiring(!showExpiring)} style={{ cursor: 'pointer' }}>
            <div className="stat-icon danger"><Clock size={24} /></div>
            <div className="stat-value">{expiringCount}</div>
            <div className="stat-label">{t('expiringLess90')}</div>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div className="search-input" style={{ width: '300px' }}>
              <Search className="search-input-icon" />
              <input type="text" className="form-input" placeholder={t('searchInventory')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ paddingLeft: '2.75rem' }} />
            </div>
            <select className="form-input form-select" style={{ width: '180px' }} value={selectedPharmacy} onChange={(e) => setSelectedPharmacy(e.target.value)}>
              {pharmacies.map(pharmacy => (<option key={pharmacy} value={pharmacy}>{pharmacy}</option>))}
            </select>
            <button className={`btn ${showLowStock ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setShowLowStock(!showLowStock)}>
              <AlertTriangle size={16} /> {t('lowStock')}
            </button>
            <button className={`btn ${showExpiring ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setShowExpiring(!showExpiring)}>
              <Clock size={16} /> {t('expiryAlert')}
            </button>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary"><ArrowLeftRight size={16} /> {t('transfer')}</button>
            <button className="btn btn-primary"><Plus size={16} /> {t('stockReceiving')}</button>
          </div>
        </div>

        {/* Results */}
        <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {t('showing')}: <strong style={{ color: 'var(--text-primary)' }}>{filteredInventory.length}</strong> {t('of')} {inventoryData.length} {t('positions')}
        </div>

        {/* Table */}
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('drug')}</th>
                  <th>{t('pharmacy')}</th>
                  <th>{t('supplier')}</th>
                  <th>{t('quantity')}</th>
                  <th>{t('status')}</th>
                  <th>{t('purchasePrice')}</th>
                  <th>{t('salePrice')}</th>
                  <th>{t('batch')}</th>
                  <th>{t('expiryTo')}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map(item => {
                  const stockStatus = getStockStatus(item.quantity, item.minStock)
                  const expiryDays = getExpiryDays(item.expiry)
                  return (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 600 }}>{item.drug[lang]}</td>
                      <td>{item.pharmacy[lang]}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{item.supplier}</td>
                      <td><span style={{ fontWeight: 600 }}>{item.quantity}</span><span style={{ color: 'var(--text-muted)' }}> / {t('min')} {item.minStock}</span></td>
                      <td><span className={`badge ${stockStatus.class}`}>{stockStatus.label}</span></td>
                      <td>{formatCurrency(item.purchasePrice)}</td>
                      <td style={{ color: 'var(--success)', fontWeight: 500 }}>{formatCurrency(item.salePrice)}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{item.batch}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>{new Date(item.expiry).toLocaleDateString('ru-RU')}</span>
                          {expiryDays <= 30 ? <span className="badge badge-danger">{expiryDays} {t('days')}</span> : expiryDays <= 90 ? <span className="badge badge-warning">{expiryDays} {t('days')}</span> : null}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button className="btn btn-icon btn-ghost"><Edit size={16} /></button>
                          <button className="btn btn-icon btn-ghost" style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
                        </div>
                      </td>
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
