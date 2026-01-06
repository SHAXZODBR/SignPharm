'use client'

import Header from '@/components/Header'
import { useLanguage } from '@/lib/LanguageContext'
import { useState, useEffect } from 'react'
import { Plus, Search, Building2, MapPin, Phone, User, Edit, Package, DollarSign, X, Loader2 } from 'lucide-react'

interface Pharmacy {
  id: string
  name: string
  region: string
  district?: string
  address?: string
  phone?: string
  email?: string
  manager?: string
  isActive: boolean
}

export default function PharmaciesPage() {
  const { t, lang, formatCurrency } = useLanguage()
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    district: '',
    address: '',
    phone: '',
    email: '',
    manager: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPharmacies()
  }, [searchQuery])

  const fetchPharmacies = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)

      const res = await fetch(`/api/pharmacies?${params}`)
      const data = await res.json()
      setPharmacies(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch pharmacies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/pharmacies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setShowAddModal(false)
        setFormData({ name: '', region: '', district: '', address: '', phone: '', email: '', manager: '' })
        fetchPharmacies()
      }
    } catch (error) {
      console.error('Failed to create pharmacy:', error)
    } finally {
      setSaving(false)
    }
  }

  const regions = [t('allRegions'), ...new Set(pharmacies.map(p => p.region).filter(Boolean))]

  const filteredPharmacies = pharmacies.filter(pharmacy => {
    const matchesSearch = pharmacy.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pharmacy.address?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion = !selectedRegion || selectedRegion === t('allRegions') || pharmacy.region === selectedRegion
    return matchesSearch && matchesRegion
  })

  const activeCount = pharmacies.filter(p => p.isActive).length

  return (
    <>
      <Header title={t('pharmacies')} subtitle={t('pharmacyNetwork')} />
      <div className="page-content">
        <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="stat-card"><div className="stat-icon primary"><Building2 size={24} /></div><div className="stat-value">{activeCount}</div><div className="stat-label">{t('activePharmacies')}</div></div>
          <div className="stat-card"><div className="stat-icon primary"><MapPin size={24} /></div><div className="stat-value">{new Set(pharmacies.map(p => p.region).filter(Boolean)).size}</div><div className="stat-label">{t('regionsCount')}</div></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="search-input" style={{ width: '280px' }}><Search className="search-input-icon" /><input type="text" className="form-input" placeholder={t('search')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ paddingLeft: '2.75rem' }} /></div>
            <select className="form-input form-select" style={{ width: '180px' }} value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>{regions.map(region => (<option key={region} value={region}>{region}</option>))}</select>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}><Plus size={16} /> {t('addPharmacy')}</button>
        </div>

        {loading ? (
          <div className="card"><div className="card-body" style={{ textAlign: 'center', padding: '3rem' }}><Loader2 className="spinner" /><p>{t('loading')}</p></div></div>
        ) : filteredPharmacies.length === 0 ? (
          <div className="card"><div className="card-body" style={{ textAlign: 'center', padding: '3rem' }}><p>{t('noData')}</p></div></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {filteredPharmacies.map(pharmacy => (
              <div key={pharmacy.id} className="card" style={{ position: 'relative' }}>
                {!pharmacy.isActive && <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}><span className="badge badge-danger">{t('inactive')}</span></div>}
                <div className="card-body">
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', background: pharmacy.isActive ? 'var(--primary-light)' : 'var(--danger-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={24} style={{ color: pharmacy.isActive ? 'var(--primary)' : 'var(--danger)' }} /></div>
                    <div style={{ flex: 1 }}><h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{pharmacy.name}</h3><p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{pharmacy.region}{pharmacy.district ? `, ${pharmacy.district}` : ''}</p></div>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    {pharmacy.address && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}><MapPin size={16} /><span style={{ fontSize: '0.9rem' }}>{pharmacy.address}</span></div>}
                    {pharmacy.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}><Phone size={16} /><span style={{ fontSize: '0.9rem' }}>{pharmacy.phone}</span></div>}
                    {pharmacy.manager && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}><User size={16} /><span style={{ fontSize: '0.9rem' }}>{pharmacy.manager}</span></div>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}><button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>{t('details')}</button><button className="btn btn-icon btn-secondary btn-sm"><Edit size={16} /></button></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header"><h3 className="modal-title">{t('addPharmacy')}</h3><button className="btn btn-icon btn-ghost" onClick={() => setShowAddModal(false)}><X size={20} /></button></div>
              <div className="modal-body">
                <div className="form-group"><label className="form-label">{t('pharmacyName')} *</label><input type="text" className="form-input" placeholder={t('pharmacyName')} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group"><label className="form-label">{t('region')} *</label><input type="text" className="form-input" placeholder={t('region')} value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">{t('district')}</label><input type="text" className="form-input" placeholder={t('district')} value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} /></div>
                </div>
                <div className="form-group"><label className="form-label">{t('address')}</label><input type="text" className="form-input" placeholder={t('fullAddress')} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group"><label className="form-label">{t('phone')}</label><input type="text" className="form-input" placeholder="+998 XX XXX-XX-XX" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">{t('email')}</label><input type="email" className="form-input" placeholder="email@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
                </div>
                <div className="form-group"><label className="form-label">{t('manager')}</label><input type="text" className="form-input" placeholder={t('managerName')} value={formData.manager} onChange={(e) => setFormData({ ...formData, manager: e.target.value })} /></div>
              </div>
              <div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>{t('cancel')}</button><button className="btn btn-primary" onClick={handleCreate} disabled={saving || !formData.name || !formData.region}>{saving ? <Loader2 className="spinner" size={16} /> : <Plus size={16} />} {t('add')}</button></div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
