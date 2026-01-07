'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

interface ExchangeRate {
    currency: string
    rate: number
    change?: number
    date: string
}

export default function ExchangeRateWidget() {
    const { lang } = useLanguage()
    const [rates, setRates] = useState<ExchangeRate[]>([])
    const [loading, setLoading] = useState(true)
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

    useEffect(() => {
        fetchRates()
    }, [])

    const fetchRates = async () => {
        setLoading(true)
        try {
            // In production, this would fetch from the actual API
            // For now, use realistic sample data for Uzbekistan
            await new Promise(resolve => setTimeout(resolve, 500))

            const today = new Date().toISOString().split('T')[0]
            setRates([
                { currency: 'USD', rate: 12850.50, change: 0.15, date: today },
                { currency: 'EUR', rate: 13920.25, change: -0.08, date: today },
                { currency: 'RUB', rate: 134.85, change: 0.22, date: today },
            ])
            setLastUpdate(new Date())
        } catch (error) {
            console.error('Failed to fetch exchange rates:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num)
    }

    const labels = {
        title: lang === 'ru' ? 'Курсы валют ЦБ РУз' : lang === 'uz' ? "O'zMB valyuta kurslari" : 'CBU Exchange Rates',
        lastUpdate: lang === 'ru' ? 'Обновлено' : lang === 'uz' ? 'Yangilangan' : 'Updated',
    }

    return (
        <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <DollarSign size={16} />
                    {labels.title}
                </h4>
                <button
                    className="btn btn-icon btn-ghost"
                    onClick={fetchRates}
                    disabled={loading}
                >
                    <RefreshCw size={16} className={loading ? 'spinner' : ''} />
                </button>
            </div>
            <div className="card-body" style={{ padding: '0.75rem' }}>
                {loading && rates.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <RefreshCw className="spinner" size={20} />
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {rates.map(rate => (
                                <div
                                    key={rate.currency}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.5rem 0.75rem',
                                        background: 'var(--surface-hover)',
                                        borderRadius: '6px',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            padding: '0.125rem 0.5rem',
                                            background: 'var(--primary)',
                                            color: 'white',
                                            borderRadius: '4px',
                                        }}>
                                            {rate.currency}
                                        </span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>/ UZS</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>
                                            {formatNumber(rate.rate)}
                                        </span>
                                        {rate.change !== undefined && (
                                            <span style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.125rem',
                                                fontSize: '0.75rem',
                                                color: rate.change > 0 ? 'var(--success)' : rate.change < 0 ? 'var(--danger)' : 'var(--text-muted)',
                                            }}>
                                                {rate.change > 0 ? <TrendingUp size={12} /> : rate.change < 0 ? <TrendingDown size={12} /> : null}
                                                {rate.change > 0 ? '+' : ''}{rate.change.toFixed(2)}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {lastUpdate && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'right' }}>
                                {labels.lastUpdate}: {lastUpdate.toLocaleTimeString()}
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
