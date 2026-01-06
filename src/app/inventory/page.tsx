'use client'

import Header from '@/components/Header'
import Modal from '@/components/Modal'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useLanguage } from '@/lib/LanguageContext'
import { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  Search,
  AlertTriangle,
  Package,
  ArrowLeftRight,
  Clock,
  Edit,
  Trash2,
  Loader2,
} from 'lucide-react'

interface Drug {
  id: string
  name: string
  nameRu?: string | null
  nameUz?: string | null
}

interface Pharmacy {
  id: string
  name: string
  nameRu?: string | null
  nameUz?: string | null
}

interface Supplier {
  id: string
  name: string
  nameRu?: string | null
}

interface InventoryItem {
  id: string
  drugId: string
  pharmacyId: string
  supplierId?: string | null
  quantity: number
  minStock: number
  purchasePriceUZS: number
  salePriceUZS: number
  batchNumber?: string | null
  expiryDate?: string | null
  drug: Drug
  pharmacy: Pharmacy
  supplier?: Supplier | null
}

function getExpiryDays(expiry: string | null | undefined) {
  if (!expiry) return 999
  const expiryDate = new Date(expiry)
  const today = new Date()
  const diffTime = expiryDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export default function InventoryPage() {
  const { t, lang } = useLanguage()
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [drugs, setDrugs] = useState<Drug[]>([])
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPharmacy, setSelectedPharmacy] = useState('')
  const [showLowStock, setShowLowStock] = useState(false)
  const [showExpiring, setShowExpiring] = useState(false)

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [saving, setSaving] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    drugId: '',
    pharmacyId: '',
    supplierId: '',
    quantity: 0,
    minStock: 10,
    purchasePriceUZS: 0,
    salePriceUZS: 0,
    batchNumber: '',
    expiryDate: '',
    invoiceNumber: '',
  })

  // Fetch inventory
  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (selectedPharmacy) params.set('pharmacyId', selectedPharmacy)
      if (showLowStock) params.set('lowStock', 'true')
      if (showExpiring) params.set('expiring', 'true')

      const res = await fetch(`/api/inventory?${params}`)
      const data = await res.json()
      setInventory(data.inventory || [])
    } catch (error) {
      console.error('Failed to fetch inventory:', error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedPharmacy, showLowStock, showExpiring])

  // Fetch reference data
  const fetchReferenceData = async () => {
    try {
      const [drugsRes, pharmaciesRes, suppliersRes] = await Promise.all([
        fetch('/api/drugs'),
        fetch('/api/pharmacies'),
        fetch('/api/suppliers'),
      ])

      const drugsData = await drugsRes.json()
      const pharmaciesData = await pharmaciesRes.json()
      const suppliersData = await suppliersRes.json()

      setDrugs(drugsData.drugs || [])
      setPharmacies(pharmaciesData || [])
      setSuppliers(suppliersData || [])
    } catch (error) {
      console.error('Failed to fetch reference data:', error)
    }
  }

  useEffect(() => {
    fetchInventory()
    fetchReferenceData()
  }, [fetchInventory])

  const getName = (item: { name: string; nameRu?: string | null; nameUz?: string | null }) => {
    if (lang === 'ru' && item.nameRu) return item.nameRu
    if (lang === 'uz' && item.nameUz) return item.nameUz
    return item.name || item.nameRu || ''
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  const resetForm = () => {
    setFormData({
      drugId: '',
      pharmacyId: '',
      supplierId: '',
      quantity: 0,
      minStock: 10,
      purchasePriceUZS: 0,
      salePriceUZS: 0,
      batchNumber: '',
      expiryDate: '',
      invoiceNumber: '',
    })
  }

  const openEditModal = (item: InventoryItem) => {
    setSelectedItem(item)
    setFormData({
      drugId: item.drugId,
      pharmacyId: item.pharmacyId,
      supplierId: item.supplierId || '',
      quantity: item.quantity,
      minStock: item.minStock,
      purchasePriceUZS: item.purchasePriceUZS,
      salePriceUZS: item.salePriceUZS,
      batchNumber: item.batchNumber || '',
      expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : '',
      invoiceNumber: '',
    })
    setShowEditModal(true)
  }

  const openDeleteConfirm = (item: InventoryItem) => {
    setSelectedItem(item)
    setShowDeleteConfirm(true)
  }

  // Create inventory (stock receiving)
  const handleCreate = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setShowAddModal(false)
        resetForm()
        fetchInventory()
      }
    } catch (error) {
      console.error('Failed to create inventory:', error)
    } finally {
      setSaving(false)
    }
  }

  // Update inventory
  const handleUpdate = async () => {
    if (!selectedItem) return

    try {
      setSaving(true)
      const res = await fetch(`/api/inventory/${selectedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setShowEditModal(false)
        setSelectedItem(null)
        fetchInventory()
      }
    } catch (error) {
      console.error('Failed to update inventory:', error)
    } finally {
      setSaving(false)
    }
  }

  // Delete inventory
  const handleDelete = async () => {
    if (!selectedItem) return

    try {
      setSaving(true)
      const res = await fetch(`/api/inventory/${selectedItem.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setShowDeleteConfirm(false)
        setSelectedItem(null)
        fetchInventory()
      }
    } catch (error) {
      console.error('Failed to delete inventory:', error)
    } finally {
      setSaving(false)
    }
  }

  // Calculate stats
  const lowStockCount = inventory.filter(i => i.quantity <= i.minStock).length
  const expiringCount = inventory.filter(i => getExpiryDays(i.expiryDate) <= 90).length
  const totalValue = inventory.reduce((sum, i) => sum + (i.quantity * i.salePriceUZS), 0)

  function getStockStatus(quantity: number, minStock: number) {
    if (quantity <= 0) return { label: lang === 'ru' ? 'Нет в наличии' : lang === 'uz' ? 'Mavjud emas' : 'Out of stock', class: 'badge-danger' }
    if (quantity <= minStock * 0.5) return { label: t('critical'), class: 'badge-danger' }
    if (quantity <= minStock) return { label: t('low'), class: 'badge-warning' }
    return { label: t('normal'), class: 'badge-success' }
  }

  function formatCurrency(value: number): string {
    return value.toLocaleString('ru-RU') + (lang === 'en' ? ' UZS' : ' сум')
  }

  // Inventory form
  const InventoryForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="form-grid">
      {!isEdit && (
        <>
          <div className="form-group">
            <label className="form-label">{t('drug')} *</label>
            <select
              name="drugId"
              className="form-input form-select"
              value={formData.drugId}
              onChange={handleInputChange}
              required
            >
              <option value="">{t('selectDrug')}</option>
              {drugs.map(drug => (
                <option key={drug.id} value={drug.id}>{getName(drug)}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{t('pharmacy')} *</label>
            <select
              name="pharmacyId"
              className="form-input form-select"
              value={formData.pharmacyId}
              onChange={handleInputChange}
              required
            >
              <option value="">{t('selectPharmacy')}</option>
              {pharmacies.map(pharmacy => (
                <option key={pharmacy.id} value={pharmacy.id}>{getName(pharmacy)}</option>
              ))}
            </select>
          </div>
        </>
      )}
      <div className="form-group">
        <label className="form-label">{t('supplier')}</label>
        <select
          name="supplierId"
          className="form-input form-select"
          value={formData.supplierId}
          onChange={handleInputChange}
        >
          <option value="">{t('selectSupplier')}</option>
          {suppliers.map(supplier => (
            <option key={supplier.id} value={supplier.id}>{supplier.nameRu || supplier.name}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">{t('quantity')} *</label>
        <input
          type="number"
          name="quantity"
          className="form-input"
          value={formData.quantity}
          onChange={handleInputChange}
          min="0"
        />
      </div>
      <div className="form-group">
        <label className="form-label">{t('minStock')}</label>
        <input
          type="number"
          name="minStock"
          className="form-input"
          value={formData.minStock}
          onChange={handleInputChange}
          min="0"
        />
      </div>
      <div className="form-group">
        <label className="form-label">{t('purchasePrice')} (UZS) *</label>
        <input
          type="number"
          name="purchasePriceUZS"
          className="form-input"
          value={formData.purchasePriceUZS}
          onChange={handleInputChange}
          min="0"
        />
      </div>
      <div className="form-group">
        <label className="form-label">{t('salePrice')} (UZS) *</label>
        <input
          type="number"
          name="salePriceUZS"
          className="form-input"
          value={formData.salePriceUZS}
          onChange={handleInputChange}
          min="0"
        />
      </div>
      <div className="form-group">
        <label className="form-label">{t('batch')}</label>
        <input
          type="text"
          name="batchNumber"
          className="form-input"
          placeholder="PAR-2024-001"
          value={formData.batchNumber}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label className="form-label">{t('expiryDate')}</label>
        <input
          type="date"
          name="expiryDate"
          className="form-input"
          value={formData.expiryDate}
          onChange={handleInputChange}
        />
      </div>
      {!isEdit && (
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label className="form-label">{t('invoiceNumber')}</label>
          <input
            type="text"
            name="invoiceNumber"
            className="form-input"
            placeholder="PO-100001"
            value={formData.invoiceNumber}
            onChange={handleInputChange}
          />
        </div>
      )}
    </div>
  )

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
            <div className="stat-value">{inventory.length}</div>
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
        <div className="toolbar">
          <div className="toolbar-left">
            <div className="search-input" style={{ width: '300px' }}>
              <Search className="search-input-icon" />
              <input
                type="text"
                className="form-input"
                placeholder={t('searchInventory')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
            <select
              className="form-input form-select"
              style={{ width: '180px' }}
              value={selectedPharmacy}
              onChange={(e) => setSelectedPharmacy(e.target.value)}
            >
              <option value="">{t('allPharmacies')}</option>
              {pharmacies.map(pharmacy => (
                <option key={pharmacy.id} value={pharmacy.id}>{getName(pharmacy)}</option>
              ))}
            </select>
            <button
              className={`btn ${showLowStock ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setShowLowStock(!showLowStock)}
            >
              <AlertTriangle size={16} /> {t('lowStock')}
            </button>
            <button
              className={`btn ${showExpiring ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setShowExpiring(!showExpiring)}
            >
              <Clock size={16} /> {t('expiryAlert')}
            </button>
          </div>
          <div className="toolbar-right">
            <button className="btn btn-secondary">
              <ArrowLeftRight size={16} /> {t('transfer')}
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                resetForm()
                setShowAddModal(true)
              }}
            >
              <Plus size={16} /> {t('stockReceiving')}
            </button>
          </div>
        </div>

        {/* Results */}
        <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {t('showing')}: <strong style={{ color: 'var(--text-primary)' }}>{inventory.length}</strong> {t('positions')}
        </div>

        {/* Table */}
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            {loading ? (
              <div className="empty-state">
                <Loader2 className="spinner" style={{ margin: '0 auto' }} />
                <p style={{ marginTop: '1rem' }}>{t('loading')}...</p>
              </div>
            ) : inventory.length === 0 ? (
              <div className="empty-state">
                <p className="empty-state-title">{t('noInventoryFound')}</p>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                  <Plus size={16} /> {t('stockReceiving')}
                </button>
              </div>
            ) : (
              <div className="table-container">
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
                    {inventory.map(item => {
                      const stockStatus = getStockStatus(item.quantity, item.minStock)
                      const expiryDays = getExpiryDays(item.expiryDate)
                      return (
                        <tr key={item.id}>
                          <td style={{ fontWeight: 600 }}>{getName(item.drug)}</td>
                          <td>{getName(item.pharmacy)}</td>
                          <td style={{ color: 'var(--text-secondary)' }}>
                            {item.supplier ? (item.supplier.nameRu || item.supplier.name) : '-'}
                          </td>
                          <td>
                            <span style={{ fontWeight: 600 }}>{item.quantity}</span>
                            <span style={{ color: 'var(--text-muted)' }}> / {t('min')} {item.minStock}</span>
                          </td>
                          <td><span className={`badge ${stockStatus.class}`}>{stockStatus.label}</span></td>
                          <td>{formatCurrency(item.purchasePriceUZS)}</td>
                          <td style={{ color: 'var(--success)', fontWeight: 500 }}>{formatCurrency(item.salePriceUZS)}</td>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{item.batchNumber || '-'}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString('ru-RU') : '-'}</span>
                              {expiryDays <= 30 ? (
                                <span className="badge badge-danger">{expiryDays} {t('days')}</span>
                              ) : expiryDays <= 90 ? (
                                <span className="badge badge-warning">{expiryDays} {t('days')}</span>
                              ) : null}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                              <button className="btn btn-icon btn-ghost" onClick={() => openEditModal(item)}>
                                <Edit size={16} />
                              </button>
                              <button
                                className="btn btn-icon btn-ghost"
                                style={{ color: 'var(--danger)' }}
                                onClick={() => openDeleteConfirm(item)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Add Modal (Stock Receiving) */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title={t('stockReceiving')}
          size="lg"
        >
          <InventoryForm />
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>{t('cancel')}</button>
            <button
              className={`btn btn-primary ${saving ? 'btn-loading' : ''}`}
              onClick={handleCreate}
              disabled={saving || !formData.drugId || !formData.pharmacyId}
            >
              <Plus size={16} /> {t('add')}
            </button>
          </div>
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title={t('edit')}
          size="lg"
        >
          <InventoryForm isEdit />
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>{t('cancel')}</button>
            <button
              className={`btn btn-primary ${saving ? 'btn-loading' : ''}`}
              onClick={handleUpdate}
              disabled={saving}
            >
              {t('save')}
            </button>
          </div>
        </Modal>

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          title={t('deleteInventory')}
          message={`${t('confirmDelete')} ${selectedItem ? getName(selectedItem.drug) : ''}?`}
          isLoading={saving}
        />
      </div>
    </>
  )
}
