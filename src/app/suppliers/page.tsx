'use client'

import Header from '@/components/Header'
import { useLanguage } from '@/lib/LanguageContext'
import { useState } from 'react'
import { Plus, Search, Truck, Building, Globe, Edit, Trash2, Eye, X, Package, DollarSign } from 'lucide-react'

const suppliersData = [
  { id: '1', name: 'Uzpharma', nameRu: 'Узфарма', type: 'MANUFACTURER', country: { ru: 'Узбекистан', uz: "O'zbekiston", en: 'Uzbekistan' }, contact: { ru: 'Алиев Рустам', uz: 'Aliyev Rustam', en: 'Aliev Rustam' }, phone: '+998 71 256-78-90', email: 'info@uzpharma.uz', isActive: true, stats: { orders: 45, totalValue: 850000000, drugs: 28 } },
  { id: '2', name: 'Nobel Pharma', nameRu: 'Нобель Фарма', type: 'DISTRIBUTOR', country: { ru: 'Турция', uz: 'Turkiya', en: 'Turkey' }, contact: { ru: 'Мехмет Йылмаз', uz: 'Mehmet Yilmaz', en: 'Mehmet Yilmaz' }, phone: '+90 212 555-12-34', email: 'info@nobelpharma.com', isActive: true, stats: { orders: 32, totalValue: 620000000, drugs: 45 } },
  { id: '3', name: 'Sandoz', nameRu: 'Сандоз', type: 'MANUFACTURER', country: { ru: 'Швейцария', uz: 'Shveytsariya', en: 'Switzerland' }, contact: { ru: 'Ханс Мюллер', uz: 'Hans Myuller', en: 'Hans Mueller' }, phone: '+41 61 324-25-26', email: 'orders@sandoz.com', isActive: true, stats: { orders: 18, totalValue: 450000000, drugs: 32 } },
  { id: '4', name: "Dr. Reddy's", nameRu: 'Доктор Реддис', type: 'MANUFACTURER', country: { ru: 'Индия', uz: 'Hindiston', en: 'India' }, contact: { ru: 'Радж Патель', uz: 'Raj Patel', en: 'Raj Patel' }, phone: '+91 40 4900-2900', email: 'export@drreddys.com', isActive: true, stats: { orders: 28, totalValue: 380000000, drugs: 56 } },
  { id: '5', name: 'Bayer', nameRu: 'Байер', type: 'MANUFACTURER', country: { ru: 'Германия', uz: 'Germaniya', en: 'Germany' }, contact: { ru: 'Клаус Шмидт', uz: 'Klaus Shmidt', en: 'Klaus Schmidt' }, phone: '+49 214 30-1', email: 'pharma@bayer.com', isActive: true, stats: { orders: 22, totalValue: 520000000, drugs: 18 } },
  { id: '6', name: 'Биоком', nameRu: 'Биоком', type: 'IMPORTER', country: { ru: 'Россия', uz: 'Rossiya', en: 'Russia' }, contact: { ru: 'Сергеев П.А.', uz: 'Sergeyev P.A.', en: 'Sergeev P.A.' }, phone: '+7 495 123-45-67', email: 'sales@biokom.ru', isActive: false, stats: { orders: 8, totalValue: 120000000, drugs: 12 } },
]

export default function SuppliersPage() {
  const { t, lang } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const supplierTypes = [
    { value: '', label: t('allTypes') },
    { value: 'MANUFACTURER', label: t('manufacturerType') },
    { value: 'DISTRIBUTOR', label: t('distributorType') },
    { value: 'IMPORTER', label: t('importerType') },
  ]

  const typeLabels: Record<string, string> = {
    MANUFACTURER: t('manufacturerType'),
    DISTRIBUTOR: t('distributorType'),
    IMPORTER: t('importerType'),
  }

  const typeBadges: Record<string, string> = { MANUFACTURER: 'badge-primary', DISTRIBUTOR: 'badge-info', IMPORTER: 'badge-warning' }

  const filteredSuppliers = suppliersData.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) || supplier.country[lang].toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = !selectedType || supplier.type === selectedType
    return matchesSearch && matchesType
  })

  const totalOrders = suppliersData.reduce((sum, s) => sum + s.stats.orders, 0)
  const totalValue = suppliersData.reduce((sum, s) => sum + s.stats.totalValue, 0)

  return (
    <>
      <Header title={t('suppliers')} subtitle={t('suppliersTitle')} />
      <div className="page-content">
        <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="stat-card"><div className="stat-icon primary"><Truck size={24} /></div><div className="stat-value">{suppliersData.filter(s => s.isActive).length}</div><div className="stat-label">{t('activeSuppliers')}</div></div>
          <div className="stat-card success"><div className="stat-icon success"><Package size={24} /></div><div className="stat-value">{totalOrders}</div><div className="stat-label">{t('totalOrders')}</div></div>
          <div className="stat-card"><div className="stat-icon primary"><DollarSign size={24} /></div><div className="stat-value">{(totalValue / 1000000000).toFixed(2)}B</div><div className="stat-label">{t('totalTurnover')} ({lang === 'en' ? 'UZS' : 'сум'})</div></div>
          <div className="stat-card"><div className="stat-icon primary"><Globe size={24} /></div><div className="stat-value">{new Set(suppliersData.map(s => s.country[lang])).size}</div><div className="stat-label">{t('countries')}</div></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="search-input" style={{ width: '280px' }}><Search className="search-input-icon" /><input type="text" className="form-input" placeholder={t('searchSuppliers')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ paddingLeft: '2.75rem' }} /></div>
            <select className="form-input form-select" style={{ width: '180px' }} value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>{supplierTypes.map(type => (<option key={type.value} value={type.value}>{type.label}</option>))}</select>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}><Plus size={16} /> {t('addSupplier')}</button>
        </div>

        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead><tr><th>{t('supplier')}</th><th>{t('supplierType')}</th><th>{t('country')}</th><th>{t('contact')}</th><th>{t('orders')}</th><th>{t('turnover')}</th><th>{t('drugsCount')}</th><th>{t('status')}</th><th>{t('actions')}</th></tr></thead>
              <tbody>
                {filteredSuppliers.map(supplier => (
                  <tr key={supplier.id}>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><div style={{ width: '40px', height: '40px', background: 'var(--primary-light)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building size={20} style={{ color: 'var(--primary)' }} /></div><div><div style={{ fontWeight: 600 }}>{supplier.name}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{supplier.nameRu}</div></div></div></td>
                    <td><span className={`badge ${typeBadges[supplier.type]}`}>{typeLabels[supplier.type]}</span></td>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Globe size={14} style={{ color: 'var(--text-muted)' }} />{supplier.country[lang]}</div></td>
                    <td><div><div style={{ fontSize: '0.9rem' }}>{supplier.contact[lang]}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{supplier.phone}</div></div></td>
                    <td style={{ fontWeight: 500 }}>{supplier.stats.orders}</td>
                    <td style={{ color: 'var(--success)', fontWeight: 500 }}>{(supplier.stats.totalValue / 1000000).toFixed(0)}M</td>
                    <td>{supplier.stats.drugs}</td>
                    <td>{supplier.isActive ? <span className="badge badge-success">{t('active')}</span> : <span className="badge badge-danger">{t('inactive')}</span>}</td>
                    <td><div style={{ display: 'flex', gap: '0.25rem' }}><button className="btn btn-icon btn-ghost"><Eye size={16} /></button><button className="btn btn-icon btn-ghost"><Edit size={16} /></button><button className="btn btn-icon btn-ghost" style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header"><h3 className="modal-title">{t('addSupplier')}</h3><button className="btn btn-icon btn-ghost" onClick={() => setShowAddModal(false)}><X size={20} /></button></div>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group"><label className="form-label">{t('name')} *</label><input type="text" className="form-input" placeholder={t('companyName')} /></div>
                  <div className="form-group"><label className="form-label">{t('supplierType')}</label><select className="form-input form-select">{supplierTypes.slice(1).map(ty => <option key={ty.value} value={ty.value}>{ty.label}</option>)}</select></div>
                  <div className="form-group"><label className="form-label">{t('country')}</label><input type="text" className="form-input" placeholder={t('country')} /></div>
                  <div className="form-group"><label className="form-label">{t('taxId')}</label><input type="text" className="form-input" placeholder={t('taxNumber')} /></div>
                  <div className="form-group"><label className="form-label">{t('contactPerson')}</label><input type="text" className="form-input" placeholder={t('name')} /></div>
                  <div className="form-group"><label className="form-label">{t('phone')}</label><input type="text" className="form-input" placeholder="+998 XX XXX-XX-XX" /></div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}><label className="form-label">{t('email')}</label><input type="email" className="form-input" placeholder="email@example.com" /></div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}><label className="form-label">{t('address')}</label><input type="text" className="form-input" placeholder={t('fullAddress')} /></div>
                </div>
              </div>
              <div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>{t('cancel')}</button><button className="btn btn-primary"><Plus size={16} /> {t('add')}</button></div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
