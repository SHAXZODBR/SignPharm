'use client'

import { Search, Bell, User } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import { useState, useEffect } from 'react'

interface AlertItem {
  type: 'lowStock' | 'expiring'
  message: string
}

export default function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const { t, lang } = useLanguage()
  const [alerts, setAlerts] = useState<AlertItem[]>([])

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch('/api/dashboard')
        if (res.ok) {
          const data = await res.json()
          const newAlerts: AlertItem[] = []

          // Add low stock alerts
          if (data.stats?.lowStockCount > 0) {
            newAlerts.push({
              type: 'lowStock',
              message: lang === 'ru'
                ? `Низкий запас: ${data.stats.lowStockCount} позиций`
                : lang === 'uz'
                  ? `Kam qoldi: ${data.stats.lowStockCount} pozitsiya`
                  : `Low stock: ${data.stats.lowStockCount} items`
            })
          }

          // Add expiring alerts
          if (data.stats?.expiringCount > 0) {
            newAlerts.push({
              type: 'expiring',
              message: lang === 'ru'
                ? `Истекает срок: ${data.stats.expiringCount} позиций`
                : lang === 'uz'
                  ? `Muddati tugaydi: ${data.stats.expiringCount} pozitsiya`
                  : `Expiring soon: ${data.stats.expiringCount} items`
            })
          }

          setAlerts(newAlerts)
        }
      } catch (error) {
        console.error('Failed to fetch alerts:', error)
      }
    }
    fetchAlerts()
  }, [lang])

  return (
    <header className="page-header">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Search */}
          <div className="search-input" style={{ width: '280px' }}>
            <Search className="search-input-icon" />
            <input
              type="text"
              className="form-input"
              placeholder={lang === 'ru' ? 'Поиск препаратов, аптек...' : lang === 'uz' ? "Dorilar, dorixonalar qidirish..." : 'Search drugs, pharmacies...'}
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>

          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button className="btn btn-icon btn-secondary">
              <Bell size={18} />
              {alerts.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '18px',
                  height: '18px',
                  background: 'var(--danger)',
                  borderRadius: '50%',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  animation: 'pulse 2s infinite'
                }}>
                  {alerts.length}
                </span>
              )}
            </button>
          </div>

          {/* User */}
          <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
            <User size={18} />
            <span>{lang === 'ru' ? 'Администратор' : lang === 'uz' ? 'Administrator' : 'Administrator'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
