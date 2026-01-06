'use client'

import Header from '@/components/Header'
import { useLanguage } from '@/lib/LanguageContext'
import { useState, useEffect } from 'react'
import { Plus, Search, Truck, Building, Globe, Edit, Trash2, Eye, X, Package, DollarSign, Loader2 } from 'lucide-react'

interface Supplier {
  id: string
  name: string
  nameRu?: string
  country?: string
  type: string
  contact?: string
  phone?: string
  email?: string
  address?: string
  inn?: string
  isActive: boolean
}

export default function SuppliersPage() {
  const { t, lang, formatCurrency } = useLanguage()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    nameRu: '',
    type: 'MANUFACTURER',
    country: '',
    contact: '',
    phone: '',
    email: '',
    address: '',
    inn: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSuppliers()
  }, [searchQuery])

  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)

      const res = await fetch(`/api/suppliers?${params}`)
      const data = await res.json()
      setSuppliers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch suppliers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setShowAddModal(false)
        setFormData({ name: '', nameRu: '', type: 'MANUFACTURER', country: '', contact: '', phone: '', email: '', address: '', inn: '' })
        fetchSuppliers()
      }
    } catch (error) {
      console.error('Failed to create supplier:', error)
    } finally {
      setSaving(false)
    }
  }

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

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.country?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = !selectedType || supplier.type === selectedType
    return matchesSearch && matchesType
  })

  const activeCount = suppliers.filter(s => s.isActive).length

  return (
    <>
      <Header title={t('suppliers')} subtitle={t('suppliersTitle')} />
      <div className="page-content">
        <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="stat-card"><div className="stat-icon primary"><Truck size={24} /></div><div className="stat-value">{activeCount}</div><div className="stat-label">{t('activeSuppliers')}</div></div>
          <div className="stat-card"><div className="stat-icon primary"><Globe size={24} /></div><div className="stat-value">{new Set(suppliers.map(s => s.country).filter(Boolean)).size}</div><div className="stat-label">{t('countries')}</div></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="search-input" style={{ width: '280px' }}><Search className="search-input-icon" /><input type="text" className="form-input" placeholder={t('searchSuppliers')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ paddingLeft: '2.75rem' }} /></div>
            <select className="form-input form-select" style={{ width: '180px' }} value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>{supplierTypes.map(type => (<option key={type.value} value={type.value}>{type.label}</option>))}</select>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}><Plus size={16} /> {t('addSupplier')}</button>
        </div>

        {loading ? (
          <div className="card"><div className="card-body" style={{ textAlign: 'center', padding: '3rem' }}><Loader2 className="spinner" /><p>{t('loading')}</p></div></div>
        ) : (
          <div className="card">
            <div className="card-body" style={{ padding: 0 }}>
              <table className="data-table">
                <thead><tr><th>{t('supplier')}</th><th>{t('supplierType')}</th><th>{t('country')}</th><th>{t('contact')}</th><th>{t('status')}</th><th>{t('actions')}</th></tr></thead>
                <tbody>
                  {filteredSuppliers.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>{t('noData')}</td></tr>
                  ) : (
                    filteredSuppliers.map(supplier => (
                      <tr key={supplier.id}>
                        <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><div style={{ width: '40px', height: '40px', background: 'var(--primary-light)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building size={20} style={{ color: 'var(--primary)' }} /></div><div><div style={{ fontWeight: 600 }}>{supplier.name}</div>{supplier.nameRu && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{supplier.nameRu}</div>}</div></div></td>
                        <td><span className={`badge ${typeBadges[supplier.type] || 'badge-info'}`}>{typeLabels[supplier.type] || supplier.type}</span></td>
                        <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Globe size={14} style={{ color: 'var(--text-muted)' }} />{supplier.country || '-'}</div></td>
                        <td><div><div style={{ fontSize: '0.9rem' }}>{supplier.contact || '-'}</div>{supplier.phone && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{supplier.phone}</div>}</div></td>
                        <td>{supplier.isActive ? <span className="badge badge-success">{t('active')}</span> : <span className="badge badge-danger">{t('inactive')}</span>}</td>
                        <td><div style={{ display: 'flex', gap: '0.25rem' }}><button className="btn btn-icon btn-ghost"><Eye size={16} /></button><button className="btn btn-icon btn-ghost"><Edit size={16} /></button><button className="btn btn-icon btn-ghost" style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button></div></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header"><h3 className="modal-title">{t('addSupplier')}</h3><button className="btn btn-icon btn-ghost" onClick={() => setShowAddModal(false)}><X size={20} /></button></div>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group"><label className="form-label">{t('name')} *</label><input type="text" className="form-input" placeholder={t('companyName')} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">{t('supplierType')}</label><select className="form-input form-select" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>{supplierTypes.slice(1).map(ty => <option key={ty.value} value={ty.value}>{ty.label}</option>)}</select></div>
                  <div className="form-group"><label className="form-label">{t('country')}</label><input type="text" className="form-input" placeholder={t('country')} value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">{t('taxId')}</label><input type="text" className="form-input" placeholder={t('taxNumber')} value={formData.inn} onChange={(e) => setFormData({ ...formData, inn: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">{t('contactPerson')}</label><input type="text" className="form-input" placeholder={t('name')} value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">{t('phone')}</label><input type="text" className="form-input" placeholder="+998 XX XXX-XX-XX" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}><label className="form-label">{t('email')}</label><input type="email" className="form-input" placeholder="email@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}><label className="form-label">{t('address')}</label><input type="text" className="form-input" placeholder={t('fullAddress')} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} /></div>
                </div>
              </div>
              <div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>{t('cancel')}</button><button className="btn btn-primary" onClick={handleCreate} disabled={saving || !formData.name}>{saving ? <Loader2 className="spinner" size={16} /> : <Plus size={16} />} {t('add')}</button></div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
