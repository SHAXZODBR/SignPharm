'use client'

import Header from '@/components/Header'
import { useLanguage } from '@/lib/LanguageContext'
import { useState, useEffect } from 'react'
import { Plus, Search, Truck, Building, Globe, Edit, Trash2, Eye, X, Package, DollarSign, Loader2, MapPin, Phone, Mail } from 'lucide-react'

interface Distributor {
    id: string
    name: string
    nameRu?: string
    country?: string
    region?: string
    type: string
    contact?: string
    phone?: string
    email?: string
    address?: string
    inn?: string
    isActive: boolean
    drugsCount?: number
}

export default function DistributorsPage() {
    const { t, lang } = useLanguage()
    const [distributors, setDistributors] = useState<Distributor[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedRegion, setSelectedRegion] = useState('')
    const [showAddModal, setShowAddModal] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        nameRu: '',
        country: 'Узбекистан',
        region: '',
        contact: '',
        phone: '',
        email: '',
        address: '',
        inn: '',
    })
    const [saving, setSaving] = useState(false)

    // Uzbekistan regions
    const regions = [
        { value: '', label: lang === 'ru' ? 'Все регионы' : lang === 'uz' ? 'Barcha viloyatlar' : 'All regions' },
        { value: 'Tashkent', label: lang === 'ru' ? 'Ташкент' : 'Toshkent' },
        { value: 'Samarkand', label: lang === 'ru' ? 'Самарканд' : 'Samarqand' },
        { value: 'Bukhara', label: lang === 'ru' ? 'Бухара' : 'Buxoro' },
        { value: 'Fergana', label: lang === 'ru' ? 'Фергана' : "Farg'ona" },
        { value: 'Andijan', label: lang === 'ru' ? 'Андижан' : 'Andijon' },
        { value: 'Namangan', label: lang === 'ru' ? 'Наманган' : 'Namangan' },
        { value: 'Kashkadarya', label: lang === 'ru' ? 'Кашкадарья' : 'Qashqadaryo' },
        { value: 'Surkhandarya', label: lang === 'ru' ? 'Сурхандарья' : 'Surxondaryo' },
        { value: 'Khorezm', label: lang === 'ru' ? 'Хорезм' : 'Xorazm' },
        { value: 'Navoi', label: lang === 'ru' ? 'Навои' : 'Navoiy' },
        { value: 'Jizzakh', label: lang === 'ru' ? 'Джизак' : 'Jizzax' },
        { value: 'Syrdarya', label: lang === 'ru' ? 'Сырдарья' : 'Sirdaryo' },
        { value: 'Karakalpakstan', label: lang === 'ru' ? 'Каракалпакстан' : "Qoraqalpog'iston" },
    ]

    useEffect(() => {
        fetchDistributors()
    }, [searchQuery])

    const fetchDistributors = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (searchQuery) params.set('search', searchQuery)

            const res = await fetch(`/api/distributors?${params}`)
            if (res.ok) {
                const data = await res.json()
                setDistributors(Array.isArray(data) ? data : data.distributors || [])
            } else {
                // If API doesn't exist yet, use sample data
                setDistributors(getSampleDistributors())
            }
        } catch (error) {
            console.error('Failed to fetch distributors:', error)
            setDistributors(getSampleDistributors())
        } finally {
            setLoading(false)
        }
    }

    const getSampleDistributors = (): Distributor[] => [
        { id: '1', name: 'GRАНО ФАРМ ТРЕЙД', nameRu: 'ГРАНО ФАРМ ТРЕЙД', country: 'Узбекистан', region: 'Tashkent', type: 'WHOLESALER', contact: 'Иванов И.И.', phone: '+998 71 123-45-67', email: 'info@granopharm.uz', address: 'г. Ташкент, Мирзо-Улугбекский район', inn: '123456789', isActive: true, drugsCount: 245 },
        { id: '2', name: 'УЗМЕДИМПЕКС', nameRu: 'УЗМЕДИМПЕКС', country: 'Узбекистан', region: 'Tashkent', type: 'IMPORTER', contact: 'Петров П.П.', phone: '+998 71 234-56-78', email: 'info@uzmedimpex.uz', address: 'г. Ташкент, Яккасарайский район', inn: '234567890', isActive: true, drugsCount: 189 },
        { id: '3', name: 'МИНИЦФАРВ', nameRu: 'МИНИЦФАРВ', country: 'Узбекистан', region: 'Samarkand', type: 'REGIONAL', contact: 'Сидоров С.С.', phone: '+998 66 123-45-67', email: 'info@minitsfarm.uz', address: 'г. Самарканд, ул. Регистан', inn: '345678901', isActive: true, drugsCount: 156 },
        { id: '4', name: 'ФАРМАЦЕВТ ПЛЮС', nameRu: 'ФАРМАЦЕВТ ПЛЮС', country: 'Узбекистан', region: 'Fergana', type: 'REGIONAL', contact: 'Алиев А.А.', phone: '+998 73 345-67-89', email: 'info@pharmaplus.uz', address: "г. Фергана, ул. Навои", inn: '456789012', isActive: true, drugsCount: 98 },
        { id: '5', name: 'ДОРИВОР САВДО', nameRu: 'ДОРИВОР САВДО', country: 'Узбекистан', region: 'Bukhara', type: 'WHOLESALER', contact: 'Каримов К.К.', phone: '+998 65 234-56-78', email: 'info@dorivor.uz', address: 'г. Бухара, ул. Мустакиллик', inn: '567890123', isActive: false, drugsCount: 67 },
    ]

    const handleCreate = async () => {
        try {
            setSaving(true)
            const res = await fetch('/api/distributors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                setShowAddModal(false)
                setFormData({ name: '', nameRu: '', country: 'Узбекистан', region: '', contact: '', phone: '', email: '', address: '', inn: '' })
                fetchDistributors()
            }
        } catch (error) {
            console.error('Failed to create distributor:', error)
        } finally {
            setSaving(false)
        }
    }

    const distributorTypes: Record<string, { ru: string; uz: string; en: string }> = {
        WHOLESALER: { ru: 'Оптовик', uz: 'Ulgurji', en: 'Wholesaler' },
        IMPORTER: { ru: 'Импортёр', uz: 'Importchi', en: 'Importer' },
        REGIONAL: { ru: 'Региональный', uz: 'Viloyat', en: 'Regional' },
        NATIONAL: { ru: 'Национальный', uz: 'Milliy', en: 'National' },
    }

    const typeBadges: Record<string, string> = {
        WHOLESALER: 'badge-primary',
        IMPORTER: 'badge-warning',
        REGIONAL: 'badge-info',
        NATIONAL: 'badge-success',
    }

    const filteredDistributors = distributors.filter(d => {
        const matchesSearch = d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.nameRu?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.region?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesRegion = !selectedRegion || d.region === selectedRegion
        return matchesSearch && matchesRegion
    })

    const activeCount = distributors.filter(d => d.isActive).length
    const regionsCount = new Set(distributors.map(d => d.region).filter(Boolean)).size
    const totalDrugs = distributors.reduce((sum, d) => sum + (d.drugsCount || 0), 0)

    return (
        <>
            <Header
                title={t('distributors')}
                subtitle={lang === 'ru' ? 'Дистрибьюторская сеть и региональные партнёры' : lang === 'uz' ? 'Distribyutorlar tarmog\'i va mintaqaviy hamkorlar' : 'Distribution network and regional partners'}
            />
            <div className="page-content">
                {/* Stats */}
                <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
                    <div className="stat-card">
                        <div className="stat-icon primary"><Truck size={24} /></div>
                        <div className="stat-value">{activeCount}</div>
                        <div className="stat-label">{lang === 'ru' ? 'Активных дистрибьюторов' : lang === 'uz' ? 'Faol distribyutorlar' : 'Active Distributors'}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon primary"><MapPin size={24} /></div>
                        <div className="stat-value">{regionsCount}</div>
                        <div className="stat-label">{t('region')}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon primary"><Package size={24} /></div>
                        <div className="stat-value">{totalDrugs}</div>
                        <div className="stat-label">{lang === 'ru' ? 'Препаратов в сети' : lang === 'uz' ? 'Tarmoqdagi dorilar' : 'Drugs in Network'}</div>
                    </div>
                </div>

                {/* Toolbar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <div className="search-input" style={{ width: '280px' }}>
                            <Search className="search-input-icon" />
                            <input
                                type="text"
                                className="form-input"
                                placeholder={lang === 'ru' ? 'Поиск дистрибьюторов...' : lang === 'uz' ? 'Distribyutorlarni qidirish...' : 'Search distributors...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ paddingLeft: '2.75rem' }}
                            />
                        </div>
                        <select
                            className="form-input form-select"
                            style={{ width: '180px' }}
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                        >
                            {regions.map(r => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                        <Plus size={16} /> {lang === 'ru' ? 'Добавить дистрибьютора' : lang === 'uz' ? "Distribyutor qo'shish" : 'Add Distributor'}
                    </button>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="card">
                        <div className="card-body" style={{ textAlign: 'center', padding: '3rem' }}>
                            <Loader2 className="spinner" />
                            <p>{t('loading')}</p>
                        </div>
                    </div>
                ) : (
                    <div className="card">
                        <div className="card-body" style={{ padding: 0 }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>{lang === 'ru' ? 'Дистрибьютор' : lang === 'uz' ? 'Distribyutor' : 'Distributor'}</th>
                                        <th>{lang === 'ru' ? 'Тип' : lang === 'uz' ? 'Turi' : 'Type'}</th>
                                        <th>{t('region')}</th>
                                        <th>{t('contact')}</th>
                                        <th>{lang === 'ru' ? 'Препаратов' : lang === 'uz' ? 'Dorilar' : 'Drugs'}</th>
                                        <th>{t('status')}</th>
                                        <th>{t('actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDistributors.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>{t('noData')}</td>
                                        </tr>
                                    ) : (
                                        filteredDistributors.map(dist => (
                                            <tr key={dist.id}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div style={{ width: '40px', height: '40px', background: 'var(--primary-light)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Truck size={20} style={{ color: 'var(--primary)' }} />
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 600 }}>{dist.name}</div>
                                                            {dist.nameRu && dist.nameRu !== dist.name && (
                                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{dist.nameRu}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge ${typeBadges[dist.type] || 'badge-info'}`}>
                                                        {distributorTypes[dist.type]?.[lang] || dist.type}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
                                                        {regions.find(r => r.value === dist.region)?.label || dist.region || '-'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <div style={{ fontSize: '0.9rem' }}>{dist.contact || '-'}</div>
                                                        {dist.phone && (
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                                <Phone size={12} /> {dist.phone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{dist.drugsCount || 0}</span>
                                                </td>
                                                <td>
                                                    {dist.isActive ? (
                                                        <span className="badge badge-success">{t('active')}</span>
                                                    ) : (
                                                        <span className="badge badge-danger">{t('inactive')}</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                        <button className="btn btn-icon btn-ghost"><Eye size={16} /></button>
                                                        <button className="btn btn-icon btn-ghost"><Edit size={16} /></button>
                                                        <button className="btn btn-icon btn-ghost" style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Add Modal */}
                {showAddModal && (
                    <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3 className="modal-title">{lang === 'ru' ? 'Добавить дистрибьютора' : lang === 'uz' ? "Distribyutor qo'shish" : 'Add Distributor'}</h3>
                                <button className="btn btn-icon btn-ghost" onClick={() => setShowAddModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="modal-body">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">{t('name')} *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder={lang === 'ru' ? 'Название компании' : lang === 'uz' ? 'Kompaniya nomi' : 'Company name'}
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">{t('region')}</label>
                                        <select
                                            className="form-input form-select"
                                            value={formData.region}
                                            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                        >
                                            {regions.map(r => (
                                                <option key={r.value} value={r.value}>{r.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">{t('taxId')}</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder={t('taxNumber')}
                                            value={formData.inn}
                                            onChange={(e) => setFormData({ ...formData, inn: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">{t('contactPerson')}</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder={t('name')}
                                            value={formData.contact}
                                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">{t('phone')}</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="+998 XX XXX-XX-XX"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">{t('email')}</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            placeholder="email@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                        <label className="form-label">{t('address')}</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder={t('fullAddress')}
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>{t('cancel')}</button>
                                <button className="btn btn-primary" onClick={handleCreate} disabled={saving || !formData.name}>
                                    {saving ? <Loader2 className="spinner" size={16} /> : <Plus size={16} />} {t('add')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
