'use client'

import Header from '@/components/Header'
import Modal from '@/components/Modal'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useLanguage } from '@/lib/LanguageContext'
import { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  Loader2,
} from 'lucide-react'

interface Drug {
  id: string
  name: string
  nameRu?: string | null
  nameUz?: string | null
  inn?: string | null
  atxCode?: string | null
  therapeuticGroup?: string | null
  form?: string | null
  dosage?: string | null
  manufacturer?: string | null
  country?: string | null
  prescription: boolean
  barcode?: string | null
}

const atxGroups = [
  { code: 'A', name: { ru: 'Пищеварительный тракт и обмен веществ', uz: "Ovqat hazm qilish va moddalar almashinuvi", en: 'Alimentary tract and metabolism' } },
  { code: 'B', name: { ru: 'Кровь и система кроветворения', uz: 'Qon va qon hosil qilish tizimi', en: 'Blood and blood forming organs' } },
  { code: 'C', name: { ru: 'Сердечно-сосудистая система', uz: 'Yurak-qon tomir tizimi', en: 'Cardiovascular system' } },
  { code: 'J', name: { ru: 'Противомикробные препараты', uz: 'Antimikrob preparatlar', en: 'Antiinfectives' } },
  { code: 'M', name: { ru: 'Костно-мышечная система', uz: "Suyak-mushak tizimi", en: 'Musculoskeletal system' } },
  { code: 'N', name: { ru: 'Нервная система', uz: 'Nerv tizimi', en: 'Nervous system' } },
  { code: 'R', name: { ru: 'Респираторная система', uz: 'Nafas olish tizimi', en: 'Respiratory system' } },
]

const initialFormData = {
  nameRu: '',
  nameUz: '',
  nameEn: '',
  inn: '',
  atxCode: '',
  therapeuticGroup: '',
  form: '',
  dosage: '',
  manufacturer: '',
  country: '',
  prescription: false,
  barcode: '',
}

export default function DrugsPage() {
  const { t, lang } = useLanguage()
  const [drugs, setDrugs] = useState<Drug[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null)
  const [formData, setFormData] = useState(initialFormData)
  const [saving, setSaving] = useState(false)

  // Fetch drugs from API
  const fetchDrugs = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)

      const res = await fetch(`/api/drugs?${params}`)
      const data = await res.json()
      setDrugs(data.drugs || [])
    } catch (error) {
      console.error('Failed to fetch drugs:', error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery])

  useEffect(() => {
    fetchDrugs()
  }, [fetchDrugs])

  // Get drug name based on language
  const getDrugName = (drug: Drug) => {
    if (lang === 'ru' && drug.nameRu) return drug.nameRu
    if (lang === 'uz' && drug.nameUz) return drug.nameUz
    return drug.name || drug.nameRu || drug.nameUz || 'Unnamed'
  }

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  // Open edit modal with drug data
  const openEditModal = (drug: Drug) => {
    setSelectedDrug(drug)
    setFormData({
      nameRu: drug.nameRu || '',
      nameUz: drug.nameUz || '',
      nameEn: drug.name || '',
      inn: drug.inn || '',
      atxCode: drug.atxCode || '',
      therapeuticGroup: drug.therapeuticGroup || '',
      form: drug.form || '',
      dosage: drug.dosage || '',
      manufacturer: drug.manufacturer || '',
      country: drug.country || '',
      prescription: drug.prescription,
      barcode: drug.barcode || '',
    })
    setShowEditModal(true)
  }

  // Open view modal
  const openViewModal = (drug: Drug) => {
    setSelectedDrug(drug)
    setShowViewModal(true)
  }

  // Open delete confirmation
  const openDeleteConfirm = (drug: Drug) => {
    setSelectedDrug(drug)
    setShowDeleteConfirm(true)
  }

  // Create new drug
  const handleCreate = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/drugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.nameEn || formData.nameRu || formData.nameUz,
          nameRu: formData.nameRu,
          nameUz: formData.nameUz,
          inn: formData.inn,
          atxCode: formData.atxCode,
          therapeuticGroup: formData.therapeuticGroup,
          form: formData.form,
          dosage: formData.dosage,
          manufacturer: formData.manufacturer,
          country: formData.country,
          prescription: formData.prescription,
          barcode: formData.barcode,
        }),
      })

      if (res.ok) {
        setShowAddModal(false)
        setFormData(initialFormData)
        fetchDrugs()
      }
    } catch (error) {
      console.error('Failed to create drug:', error)
    } finally {
      setSaving(false)
    }
  }

  // Update drug
  const handleUpdate = async () => {
    if (!selectedDrug) return

    try {
      setSaving(true)
      const res = await fetch(`/api/drugs/${selectedDrug.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.nameEn || formData.nameRu || formData.nameUz,
          nameRu: formData.nameRu,
          nameUz: formData.nameUz,
          inn: formData.inn,
          atxCode: formData.atxCode,
          therapeuticGroup: formData.therapeuticGroup,
          form: formData.form,
          dosage: formData.dosage,
          manufacturer: formData.manufacturer,
          country: formData.country,
          prescription: formData.prescription,
          barcode: formData.barcode,
        }),
      })

      if (res.ok) {
        setShowEditModal(false)
        setSelectedDrug(null)
        fetchDrugs()
      }
    } catch (error) {
      console.error('Failed to update drug:', error)
    } finally {
      setSaving(false)
    }
  }

  // Delete drug
  const handleDelete = async () => {
    if (!selectedDrug) return

    try {
      setSaving(true)
      const res = await fetch(`/api/drugs/${selectedDrug.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setShowDeleteConfirm(false)
        setSelectedDrug(null)
        fetchDrugs()
      }
    } catch (error) {
      console.error('Failed to delete drug:', error)
    } finally {
      setSaving(false)
    }
  }

  // Drug form component (reused for add/edit)
  const DrugForm = () => (
    <div className="form-grid">
      <div className="form-group">
        <label className="form-label">{t('tradeName')} (RU) *</label>
        <input
          type="text"
          name="nameRu"
          className="form-input"
          placeholder="Парацетамол"
          value={formData.nameRu}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label className="form-label">{t('tradeName')} (UZ)</label>
        <input
          type="text"
          name="nameUz"
          className="form-input"
          placeholder="Paratsetamol"
          value={formData.nameUz}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label className="form-label">{t('tradeName')} (EN)</label>
        <input
          type="text"
          name="nameEn"
          className="form-input"
          placeholder="Paracetamol"
          value={formData.nameEn}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label className="form-label">{t('inn')}</label>
        <input
          type="text"
          name="inn"
          className="form-input"
          placeholder="Paracetamolum"
          value={formData.inn}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label className="form-label">{t('atxCode')}</label>
        <input
          type="text"
          name="atxCode"
          className="form-input"
          placeholder="N02BE01"
          value={formData.atxCode}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label className="form-label">{t('therapeuticGroup')}</label>
        <input
          type="text"
          name="therapeuticGroup"
          className="form-input"
          placeholder={t('therapeuticGroup')}
          value={formData.therapeuticGroup}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label className="form-label">{t('form')}</label>
        <select
          name="form"
          className="form-input form-select"
          value={formData.form}
          onChange={handleInputChange}
        >
          <option value="">{t('selectForm')}</option>
          <option value="Tablets">{t('tablets')}</option>
          <option value="Capsules">{t('capsules')}</option>
          <option value="Syrup">{t('syrup')}</option>
          <option value="Solution">{t('solution')}</option>
          <option value="Powder">{t('powder')}</option>
          <option value="Gel">{t('gel')}</option>
          <option value="Cream">{t('cream')}</option>
          <option value="Ointment">{t('ointment')}</option>
          <option value="Drops">{t('drops')}</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">{t('dosage')}</label>
        <input
          type="text"
          name="dosage"
          className="form-input"
          placeholder="500mg"
          value={formData.dosage}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label className="form-label">{t('manufacturer')}</label>
        <input
          type="text"
          name="manufacturer"
          className="form-input"
          placeholder={t('manufacturer')}
          value={formData.manufacturer}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label className="form-label">{t('country')}</label>
        <input
          type="text"
          name="country"
          className="form-input"
          placeholder={t('countryOfOrigin')}
          value={formData.country}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label className="form-label">{t('barcode')}</label>
        <input
          type="text"
          name="barcode"
          className="form-input"
          placeholder="8600000000001"
          value={formData.barcode}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="prescription"
            className="checkbox-input"
            checked={formData.prescription}
            onChange={handleInputChange}
          />
          {t('prescriptionDrug')} (Rx)
        </label>
      </div>
    </div>
  )

  return (
    <>
      <Header
        title={t('drugs')}
        subtitle={t('drugCatalog')}
      />

      <div className="page-content">
        {/* Toolbar */}
        <div className="toolbar">
          <div className="toolbar-left">
            <div className="search-input" style={{ width: '300px' }}>
              <Search className="search-input-icon" />
              <input
                type="text"
                className="form-input"
                placeholder={t('searchDrugs')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>

            <button
              className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              {t('filters')}
            </button>
          </div>

          <div className="toolbar-right">
            <button className="btn btn-secondary">
              <Download size={16} />
              {t('export')}
            </button>
            <button className="btn btn-secondary">
              <Upload size={16} />
              {t('import')}
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                setFormData(initialFormData)
                setShowAddModal(true)
              }}
            >
              <Plus size={16} />
              {t('addDrug')}
            </button>
          </div>
        </div>

        {/* ATX Filter Panel */}
        {showFilters && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-body">
              <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>{t('atxClassification')}</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {atxGroups.map(group => (
                  <button
                    key={group.code}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}
                    onClick={() => setSearchQuery(group.code)}
                  >
                    <span style={{
                      background: 'var(--primary)',
                      color: 'white',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {group.code}
                    </span>
                    {group.name[lang]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {t('found')}: <strong style={{ color: 'var(--text-primary)' }}>{drugs.length}</strong> {lang === 'ru' ? 'препаратов' : lang === 'uz' ? 'dori' : 'drugs'}
        </div>

        {/* Drugs Table */}
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            {loading ? (
              <div className="empty-state">
                <Loader2 className="spinner" style={{ margin: '0 auto' }} />
                <p style={{ marginTop: '1rem' }}>{t('loading')}...</p>
              </div>
            ) : drugs.length === 0 ? (
              <div className="empty-state">
                <p className="empty-state-title">{t('noDrugsFound')}</p>
                <p className="empty-state-message">{t('addFirstDrug')}</p>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                  <Plus size={16} /> {t('addDrug')}
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t('name')}</th>
                      <th>{t('inn')}</th>
                      <th>{t('atxCode')}</th>
                      <th>{t('therapeuticGroup')}</th>
                      <th>{t('form')}</th>
                      <th>{t('dosage')}</th>
                      <th>{t('manufacturer')}</th>
                      <th>Rx</th>
                      <th>{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drugs.map(drug => (
                      <tr key={drug.id}>
                        <td style={{ fontWeight: 600 }}>{getDrugName(drug)}</td>
                        <td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>{drug.inn || '-'}</td>
                        <td>{drug.atxCode ? <span className="badge badge-primary">{drug.atxCode}</span> : '-'}</td>
                        <td>{drug.therapeuticGroup || '-'}</td>
                        <td>{drug.form || '-'}</td>
                        <td>{drug.dosage || '-'}</td>
                        <td>
                          <div>
                            <div>{drug.manufacturer || '-'}</div>
                            {drug.country && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{drug.country}</div>}
                          </div>
                        </td>
                        <td>
                          {drug.prescription ? (
                            <span className="badge badge-warning">Rx</span>
                          ) : (
                            <span className="badge badge-success">OTC</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button className="btn btn-icon btn-ghost" onClick={() => openViewModal(drug)}>
                              <Eye size={16} />
                            </button>
                            <button className="btn btn-icon btn-ghost" onClick={() => openEditModal(drug)}>
                              <Edit size={16} />
                            </button>
                            <button className="btn btn-icon btn-ghost" style={{ color: 'var(--danger)' }} onClick={() => openDeleteConfirm(drug)}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Add Drug Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title={t('addDrug')}
          size="lg"
        >
          <DrugForm />
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>{t('cancel')}</button>
            <button
              className={`btn btn-primary ${saving ? 'btn-loading' : ''}`}
              onClick={handleCreate}
              disabled={saving || !formData.nameRu}
            >
              <Plus size={16} /> {t('add')}
            </button>
          </div>
        </Modal>

        {/* Edit Drug Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title={t('edit') + ': ' + (selectedDrug ? getDrugName(selectedDrug) : '')}
          size="lg"
        >
          <DrugForm />
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

        {/* View Drug Modal */}
        <Modal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          title={selectedDrug ? getDrugName(selectedDrug) : ''}
          size="lg"
        >
          {selectedDrug && (
            <div className="form-grid">
              <div>
                <label className="form-label">{t('tradeName')}</label>
                <div style={{ fontWeight: 500 }}>{getDrugName(selectedDrug)}</div>
              </div>
              <div>
                <label className="form-label">{t('inn')}</label>
                <div style={{ fontStyle: 'italic' }}>{selectedDrug.inn || '-'}</div>
              </div>
              <div>
                <label className="form-label">{t('atxCode')}</label>
                <div>{selectedDrug.atxCode ? <span className="badge badge-primary">{selectedDrug.atxCode}</span> : '-'}</div>
              </div>
              <div>
                <label className="form-label">{t('therapeuticGroup')}</label>
                <div>{selectedDrug.therapeuticGroup || '-'}</div>
              </div>
              <div>
                <label className="form-label">{t('form')}</label>
                <div>{selectedDrug.form || '-'}</div>
              </div>
              <div>
                <label className="form-label">{t('dosage')}</label>
                <div>{selectedDrug.dosage || '-'}</div>
              </div>
              <div>
                <label className="form-label">{t('manufacturer')}</label>
                <div>{selectedDrug.manufacturer || '-'}{selectedDrug.country ? `, ${selectedDrug.country}` : ''}</div>
              </div>
              <div>
                <label className="form-label">{t('prescription')}</label>
                <div>
                  {selectedDrug.prescription ? (
                    <span className="badge badge-warning">{t('prescription')} (Rx)</span>
                  ) : (
                    <span className="badge badge-success">OTC</span>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => setShowViewModal(false)}>{t('close')}</button>
            <button className="btn btn-primary" onClick={() => {
              setShowViewModal(false)
              if (selectedDrug) openEditModal(selectedDrug)
            }}>
              <Edit size={16} /> {t('edit')}
            </button>
          </div>
        </Modal>

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          title={t('deleteDrug')}
          message={`${t('confirmDelete')} "${selectedDrug ? getDrugName(selectedDrug) : ''}"?`}
          isLoading={saving}
        />
      </div>
    </>
  )
}
