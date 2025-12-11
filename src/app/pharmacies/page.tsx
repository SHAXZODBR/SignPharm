'use client'

import Header from '@/components/Header'
import { useLanguage } from '@/lib/LanguageContext'
import { useState } from 'react'
import { Plus, Search, Building2, MapPin, Phone, User, Edit, Package, DollarSign, X } from 'lucide-react'

const pharmaciesData = [
  { id: '1', name: { ru: 'Аптека №1', uz: 'Dorixona №1', en: 'Pharmacy #1' }, region: { ru: 'Ташкент', uz: 'Toshkent', en: 'Tashkent' }, district: { ru: 'Чиланзарский район', uz: 'Chilonzor tumani', en: 'Chilanzar District' }, address: { ru: 'ул. Катартал, 28', uz: 'Katartal ko\'chasi, 28', en: '28 Katartal St' }, phone: '+998 71 123-45-67', email: 'apteka1@pharma.uz', manager: { ru: 'Иванова А.С.', uz: 'Ivanova A.S.', en: 'Ivanova A.S.' }, isActive: true, stats: { drugs: 245, inventory: 156000000, sales: 12500000 } },
  { id: '2', name: { ru: 'Аптека №2', uz: 'Dorixona №2', en: 'Pharmacy #2' }, region: { ru: 'Ташкент', uz: 'Toshkent', en: 'Tashkent' }, district: { ru: 'Юнусабадский район', uz: 'Yunusobod tumani', en: 'Yunusobod District' }, address: { ru: 'ул. Амира Темура, 108', uz: 'Amir Temur ko\'chasi, 108', en: '108 Amir Temur St' }, phone: '+998 71 234-56-78', email: 'apteka2@pharma.uz', manager: { ru: 'Петров И.В.', uz: 'Petrov I.V.', en: 'Petrov I.V.' }, isActive: true, stats: { drugs: 198, inventory: 124000000, sales: 9800000 } },
  { id: '3', name: { ru: 'Аптека №3', uz: 'Dorixona №3', en: 'Pharmacy #3' }, region: { ru: 'Ташкент', uz: 'Toshkent', en: 'Tashkent' }, district: { ru: 'Мирзо-Улугбекский район', uz: 'Mirzo Ulugbek tumani', en: 'Mirzo Ulugbek District' }, address: { ru: 'ул. Мустакиллик, 45', uz: 'Mustaqillik ko\'chasi, 45', en: '45 Mustaqillik St' }, phone: '+998 71 345-67-89', email: 'apteka3@pharma.uz', manager: { ru: 'Сидорова М.К.', uz: 'Sidorova M.K.', en: 'Sidorova M.K.' }, isActive: true, stats: { drugs: 156, inventory: 89000000, sales: 7200000 } },
  { id: '4', name: { ru: 'Аптека №4', uz: 'Dorixona №4', en: 'Pharmacy #4' }, region: { ru: 'Самарканд', uz: 'Samarqand', en: 'Samarkand' }, district: { ru: 'Самаркандский район', uz: 'Samarqand tumani', en: 'Samarkand District' }, address: { ru: 'пр. Регистан, 12', uz: 'Registon ko\'chasi, 12', en: '12 Registan Ave' }, phone: '+998 66 123-45-67', email: 'apteka4@pharma.uz', manager: { ru: 'Алиев Р.Ш.', uz: 'Aliyev R.Sh.', en: 'Aliev R.Sh.' }, isActive: false, stats: { drugs: 0, inventory: 0, sales: 0 } },
]

export default function PharmaciesPage() {
  const { t, lang } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const regions = [t('allRegions'), ...new Set(pharmaciesData.map(p => p.region[lang]))]

  const filteredPharmacies = pharmaciesData.filter(pharmacy => {
    const matchesSearch = pharmacy.name[lang].toLowerCase().includes(searchQuery.toLowerCase()) || pharmacy.address[lang].toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion = !selectedRegion || selectedRegion === t('allRegions') || pharmacy.region[lang] === selectedRegion
    return matchesSearch && matchesRegion
  })

  const totalInventory = pharmaciesData.reduce((sum, p) => sum + p.stats.inventory, 0)
  const totalSales = pharmaciesData.reduce((sum, p) => sum + p.stats.sales, 0)

  return (
    <>
      <Header title={t('pharmacies')} subtitle={t('pharmacyNetwork')} />
      <div className="page-content">
        <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="stat-card"><div className="stat-icon primary"><Building2 size={24} /></div><div className="stat-value">{pharmaciesData.filter(p => p.isActive).length}</div><div className="stat-label">{t('activePharmacies')}</div></div>
          <div className="stat-card success"><div className="stat-icon success"><Package size={24} /></div><div className="stat-value">{(totalInventory / 1000000).toFixed(0)}M</div><div className="stat-label">{t('totalStock')} ({lang === 'en' ? 'UZS' : 'сум'})</div></div>
          <div className="stat-card"><div className="stat-icon primary"><DollarSign size={24} /></div><div className="stat-value">{(totalSales / 1000000).toFixed(1)}M</div><div className="stat-label">{t('todaySales')}</div></div>
          <div className="stat-card"><div className="stat-icon primary"><MapPin size={24} /></div><div className="stat-value">{new Set(pharmaciesData.map(p => p.region[lang])).size}</div><div className="stat-label">{t('regionsCount')}</div></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="search-input" style={{ width: '280px' }}><Search className="search-input-icon" /><input type="text" className="form-input" placeholder={t('search')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ paddingLeft: '2.75rem' }} /></div>
            <select className="form-input form-select" style={{ width: '180px' }} value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>{regions.map(region => (<option key={region} value={region}>{region}</option>))}</select>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}><Plus size={16} /> {t('addPharmacy')}</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {filteredPharmacies.map(pharmacy => (
            <div key={pharmacy.id} className="card" style={{ position: 'relative' }}>
              {!pharmacy.isActive && <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}><span className="badge badge-danger">{t('inactive')}</span></div>}
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', background: pharmacy.isActive ? 'var(--primary-light)' : 'var(--danger-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={24} style={{ color: pharmacy.isActive ? 'var(--primary)' : 'var(--danger)' }} /></div>
                  <div style={{ flex: 1 }}><h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{pharmacy.name[lang]}</h3><p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{pharmacy.region[lang]}, {pharmacy.district[lang]}</p></div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}><MapPin size={16} /><span style={{ fontSize: '0.9rem' }}>{pharmacy.address[lang]}</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}><Phone size={16} /><span style={{ fontSize: '0.9rem' }}>{pharmacy.phone}</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}><User size={16} /><span style={{ fontSize: '0.9rem' }}>{pharmacy.manager[lang]}</span></div>
                </div>
                {pharmacy.isActive && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', padding: '1rem', background: 'var(--background-tertiary)', borderRadius: '10px', marginBottom: '1rem' }}>
                    <div style={{ textAlign: 'center' }}><div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{pharmacy.stats.drugs}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('drugsCount')}</div></div>
                    <div style={{ textAlign: 'center' }}><div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{(pharmacy.stats.inventory / 1000000).toFixed(0)}M</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('stock')}</div></div>
                    <div style={{ textAlign: 'center' }}><div style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--success)' }}>{(pharmacy.stats.sales / 1000000).toFixed(1)}M</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('sales')}</div></div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.5rem' }}><button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>{t('details')}</button><button className="btn btn-icon btn-secondary btn-sm"><Edit size={16} /></button></div>
              </div>
            </div>
          ))}
        </div>

        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header"><h3 className="modal-title">{t('addPharmacy')}</h3><button className="btn btn-icon btn-ghost" onClick={() => setShowAddModal(false)}><X size={20} /></button></div>
              <div className="modal-body">
                <div className="form-group"><label className="form-label">{t('pharmacyName')} *</label><input type="text" className="form-input" placeholder={t('pharmacyName')} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group"><label className="form-label">{t('region')}</label><input type="text" className="form-input" placeholder={t('region')} /></div>
                  <div className="form-group"><label className="form-label">{t('district')}</label><input type="text" className="form-input" placeholder={t('district')} /></div>
                </div>
                <div className="form-group"><label className="form-label">{t('address')}</label><input type="text" className="form-input" placeholder={t('fullAddress')} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group"><label className="form-label">{t('phone')}</label><input type="text" className="form-input" placeholder="+998 XX XXX-XX-XX" /></div>
                  <div className="form-group"><label className="form-label">{t('email')}</label><input type="email" className="form-input" placeholder="email@example.com" /></div>
                </div>
                <div className="form-group"><label className="form-label">{t('manager')}</label><input type="text" className="form-input" placeholder={t('managerName')} /></div>
              </div>
              <div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>{t('cancel')}</button><button className="btn btn-primary"><Plus size={16} /> {t('add')}</button></div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
