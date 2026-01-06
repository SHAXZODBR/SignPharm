'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { useLanguage } from '@/lib/LanguageContext'
import { Plus, Search, ShoppingCart, ArrowUpRight, ArrowDownLeft, Clock, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Transaction {
  id: string
  type: string
  invoiceNumber: string | null
  drug: { name: string; nameRu?: string; nameUz?: string }
  pharmacy: { name: string }
  quantity: number
  unitPriceUZS: number
  totalAmountUZS: number
  createdAt: string
}

export default function SalesPage() {
  const { t, lang, formatCurrency } = useLanguage()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('')

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const queryParams = new URLSearchParams()
        if (selectedType) queryParams.append('type', selectedType)

        const res = await fetch(`/api/transactions?${queryParams.toString()}`)
        if (!res.ok) throw new Error('Failed to fetch transactions')
        const data = await res.json()
        setTransactions(data.transactions || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [selectedType])

  const transactionTypes = [
    { value: '', label: t('allOperationsType') },
    { value: 'SALE', label: t('sale') },
    { value: 'PURCHASE', label: t('purchase') },
    { value: 'RETURN', label: t('return') },
  ]

  const typeLabels: Record<string, string> = { SALE: t('sale'), PURCHASE: t('purchase'), RETURN: t('return') }
  const typeIcons: Record<string, typeof ArrowUpRight> = { SALE: ArrowUpRight, PURCHASE: ArrowDownLeft, RETURN: ArrowDownLeft }

  const filteredTransactions = transactions.filter(tx => {
    const drugName = tx.drug?.name || ''
    const invoice = tx.invoiceNumber || ''
    return drugName.toLowerCase().includes(searchQuery.toLowerCase()) || invoice.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const today = new Date().toDateString()
  const todaySales = transactions
    .filter(tx => tx.type === 'SALE' && new Date(tx.createdAt).toDateString() === today)
    .reduce((sum, tx) => sum + tx.totalAmountUZS, 0)

  const todayPurchases = transactions
    .filter(tx => tx.type === 'PURCHASE' && new Date(tx.createdAt).toDateString() === today)
    .reduce((sum, tx) => sum + tx.totalAmountUZS, 0)

  function formatDateTime(date: string): string {
    return new Date(date).toLocaleString(lang === 'en' ? 'en-GB' : 'ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  function getDrugName(drug: any) {
    if (!drug) return 'Unknown'
    if (lang === 'ru' && drug.nameRu) return drug.nameRu
    if (lang === 'uz' && drug.nameUz) return drug.nameUz
    return drug.name
  }

  return (
    <>
      <Header title={t('salesAndOperations')} subtitle={t('transactionHistory')} />
      <div className="page-content">
        {/* Stats Cards */}
        <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="stat-card success">
            <div className="stat-icon success">
              <ArrowUpRight size={24} />
            </div>
            <div className="stat-value">{formatCurrency(todaySales)}</div>
            <div className="stat-label">{t('salesToday')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon primary">
              <ArrowDownLeft size={24} />
            </div>
            <div className="stat-value">{formatCurrency(todayPurchases)}</div>
            <div className="stat-label">{t('purchasesToday')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon primary">
              <ShoppingCart size={24} />
            </div>
            <div className="stat-value">
              {transactions.filter(t => t.type === 'SALE' && new Date(t.createdAt).toDateString() === today).length}
            </div>
            <div className="stat-label">{lang === 'ru' ? 'Продаж сегодня' : lang === 'uz' ? 'Bugungi sotuvlar' : "Today's Sales"}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon primary">
              <Clock size={24} />
            </div>
            <div className="stat-value">{transactions.length}</div>
            <div className="stat-label">{t('totalOperations')}</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div className="search-input" style={{ width: '280px' }}>
              <Search className="search-input-icon" />
              <input
                type="text"
                className="form-input"
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
            <select
              className="form-input form-select"
              style={{ width: '180px' }}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {transactionTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link href="/sales/new">
              <button className="btn btn-primary">
                <Plus size={16} /> {t('newSale')}
              </button>
            </Link>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{lang === 'ru' ? 'Тип' : lang === 'uz' ? 'Tur' : 'Type'}</th>
                  <th>{t('document')}</th>
                  <th>{t('drug')}</th>
                  <th>{t('pharmacy')}</th>
                  <th>{t('quantity')}</th>
                  <th>{t('totalAmount')}</th>
                  <th>{t('dateTime')}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                      <div className="spinner" style={{ margin: '0 auto' }}></div>
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map(tx => {
                    const Icon = typeIcons[tx.type] || ArrowUpRight
                    return (
                      <tr key={tx.id}>
                        <td>
                          <span className={`badge ${tx.type === 'SALE' ? 'badge-success' :
                            tx.type === 'PURCHASE' ? 'badge-info' : 'badge-warning'
                            }`}>
                            <Icon size={12} style={{ marginRight: '4px' }} />
                            {typeLabels[tx.type] || tx.type}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {tx.invoiceNumber || '-'}
                        </td>
                        <td style={{ fontWeight: 500 }}>{getDrugName(tx.drug)}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{tx.pharmacy?.name}</td>
                        <td>{tx.quantity} {t('pcs')}</td>
                        <td style={{ fontWeight: 600, color: tx.type === 'SALE' ? 'var(--success)' : 'var(--text-primary)' }}>
                          {formatCurrency(tx.totalAmountUZS)}
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          {formatDateTime(tx.createdAt)}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
