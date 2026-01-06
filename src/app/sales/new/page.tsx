'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import {
    Search,
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    CreditCard,
    Building2,
    Package,
    ArrowLeft,
    CheckCircle2
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Pharmacy {
    id: string
    name: string
}

interface InventoryItem {
    id: string
    quantity: number
    salePriceUZS: number
    drug: {
        id: string
        name: string
        nameRu?: string
        nameUz?: string
    }
}

interface CartItem extends InventoryItem {
    cartQuantity: number
}

export default function NewSalePage() {
    const { t, lang, formatCurrency } = useLanguage()
    const router = useRouter()

    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
    const [selectedPharmacy, setSelectedPharmacy] = useState<string>('')

    const [inventory, setInventory] = useState<InventoryItem[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loadingInventory, setLoadingInventory] = useState(false)

    const [cart, setCart] = useState<CartItem[]>([])
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        fetch('/api/pharmacies')
            .then(res => res.json())
            .then(data => {
                setPharmacies(data)
                if (data.length > 0) setSelectedPharmacy(data[0].id)
            })
            .catch(err => console.error('Failed to fetch pharmacies', err))
    }, [])

    useEffect(() => {
        if (!selectedPharmacy) return

        const fetchInventory = async () => {
            setLoadingInventory(true)
            try {
                const params = new URLSearchParams({
                    pharmacyId: selectedPharmacy,
                    search: searchQuery,
                    limit: '20'
                })
                const res = await fetch(`/api/inventory?${params.toString()}`)
                const data = await res.json()
                setInventory(data.inventory || [])
            } catch (err) {
                console.error('Failed to fetch inventory', err)
            } finally {
                setLoadingInventory(false)
            }
        }

        const debounce = setTimeout(fetchInventory, 300)
        return () => clearTimeout(debounce)
    }, [searchQuery, selectedPharmacy])

    const addToCart = (item: InventoryItem) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id)
            if (existing) {
                if (existing.cartQuantity >= item.quantity) return prev
                return prev.map(i => i.id === item.id ? { ...i, cartQuantity: i.cartQuantity + 1 } : i)
            }
            return [...prev, { ...item, cartQuantity: 1 }]
        })
    }

    const removeFromCart = (itemId: string) => {
        setCart(prev => prev.filter(i => i.id !== itemId))
    }

    const updateQuantity = (itemId: string, delta: number) => {
        setCart(prev => prev.map(i => {
            if (i.id !== itemId) return i
            const newQty = i.cartQuantity + delta
            if (newQty <= 0) return i
            if (newQty > i.quantity) return i
            return { ...i, cartQuantity: newQty }
        }))
    }

    const cartTotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + (item.cartQuantity * item.salePriceUZS), 0)
    }, [cart])

    const handleCheckout = async () => {
        if (!selectedPharmacy || cart.length === 0) return

        setLoadingSubmit(true)
        try {
            await Promise.all(cart.map(item =>
                fetch('/api/transactions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'SALE',
                        drugId: item.drug.id,
                        pharmacyId: selectedPharmacy,
                        quantity: item.cartQuantity,
                        unitPriceUZS: item.salePriceUZS,
                        salePriceUZS: item.salePriceUZS,
                        totalAmountUZS: item.cartQuantity * item.salePriceUZS
                    })
                })
            ))

            setSuccess(true)
            setCart([])
        } catch (err) {
            console.error('Checkout failed', err)
            alert('Checkout failed. Please try again.')
        } finally {
            setLoadingSubmit(false)
        }
    }

    if (success) {
        return (
            <div className="loading-container">
                <div className="loading-content" style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'var(--success-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem'
                    }}>
                        <CheckCircle2 size={40} style={{ color: 'var(--success)' }} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t('save')}d!</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{t('transactionCompleted')}</p>
                    <button
                        onClick={() => { setSuccess(false); router.refresh(); }}
                        className="btn btn-primary"
                        style={{ marginRight: '1rem' }}
                    >
                        {t('startNewSale')}
                    </button>
                    <Link href="/sales" className="btn btn-secondary">
                        {t('viewSalesHistory')}
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.5rem',
                background: 'var(--background-secondary)',
                borderBottom: '1px solid var(--border)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/sales" style={{ color: 'var(--text-secondary)' }}>
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t('pointOfSale')}</h1>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Building2 size={16} style={{ color: 'var(--text-secondary)' }} />
                    <select
                        className="form-input form-select"
                        style={{ width: 'auto', padding: '0.5rem 2rem 0.5rem 0.75rem' }}
                        value={selectedPharmacy}
                        onChange={(e) => {
                            setSelectedPharmacy(e.target.value)
                            setCart([])
                        }}
                    >
                        {pharmacies.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Left: Product Selection */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem', borderRight: '1px solid var(--border)' }}>
                    <div className="search-input" style={{ marginBottom: '1.5rem' }}>
                        <Search className="search-input-icon" />
                        <input
                            type="text"
                            autoFocus
                            placeholder={t('search')}
                            className="form-input"
                            style={{ paddingLeft: '2.75rem', height: '48px', fontSize: '1rem' }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {loadingInventory ? (
                            <div className="empty-state">
                                <div className="spinner" style={{ margin: '0 auto' }}></div>
                                <p style={{ marginTop: '1rem' }}>{t('loadingProducts')}</p>
                            </div>
                        ) : inventory.length === 0 ? (
                            <div className="empty-state">
                                <Package className="empty-state-icon" />
                                <p>{t('noProductsFound')}</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                                {inventory.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => addToCart(item)}
                                        disabled={item.quantity <= 0}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            padding: '1rem',
                                            background: 'var(--surface)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '12px',
                                            cursor: item.quantity > 0 ? 'pointer' : 'not-allowed',
                                            opacity: item.quantity > 0 ? 1 : 0.5,
                                            textAlign: 'left',
                                            transition: 'all 0.2s ease',
                                            color: 'var(--text-primary)'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (item.quantity > 0) e.currentTarget.style.background = 'var(--surface-hover)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'var(--surface)'
                                        }}
                                    >
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '8px',
                                            background: 'var(--primary-light)',
                                            color: 'var(--primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '0.75rem'
                                        }}>
                                            <Package size={18} />
                                        </div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                                            {item.drug.name}
                                        </div>
                                        <div style={{ marginTop: 'auto', width: '100%' }}>
                                            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}>
                                                {formatCurrency(item.salePriceUZS)}
                                            </div>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: item.quantity < 10 ? 'var(--warning)' : 'var(--text-secondary)'
                                            }}>
                                                {item.quantity} {t('inStock')}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Cart */}
                <div style={{ width: '360px', display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1.25rem 1.5rem',
                        borderBottom: '1px solid var(--border)'
                    }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>
                            <ShoppingCart size={18} /> {t('currentOrder')}
                        </h2>
                        <span className="badge badge-primary">
                            {cart.reduce((s, i) => s + i.cartQuantity, 0)} {t('items')}
                        </span>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                        {cart.length === 0 ? (
                            <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                                <ShoppingCart className="empty-state-icon" />
                                <p>{t('cartEmpty')}</p>
                                <p style={{ fontSize: '0.8rem' }}>{t('selectProducts')}</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {cart.map(item => (
                                    <div key={item.id} style={{
                                        padding: '0.75rem',
                                        background: 'var(--background-tertiary)',
                                        borderRadius: '10px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{item.drug.name}</span>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="btn btn-ghost btn-icon"
                                                style={{ width: '24px', height: '24px', color: 'var(--text-secondary)' }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ fontWeight: 600, color: 'var(--success)' }}>
                                                {formatCurrency(item.salePriceUZS * item.cartQuantity)}
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                background: 'var(--surface)',
                                                borderRadius: '8px',
                                                padding: '0.25rem'
                                            }}>
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="btn btn-ghost btn-icon"
                                                    style={{ width: '28px', height: '28px' }}
                                                    disabled={item.cartQuantity <= 1}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span style={{ width: '24px', textAlign: 'center', fontWeight: 500 }}>{item.cartQuantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="btn btn-ghost btn-icon"
                                                    style={{ width: '28px', height: '28px' }}
                                                    disabled={item.cartQuantity >= item.quantity}
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>{t('subtotal')}</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatCurrency(cartTotal)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={cart.length === 0 || loadingSubmit}
                            className="btn btn-primary"
                            style={{ width: '100%', height: '48px', fontSize: '1rem' }}
                        >
                            {loadingSubmit ? (
                                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                            ) : (
                                <>
                                    <CreditCard size={18} />
                                    {t('completeSale')}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
