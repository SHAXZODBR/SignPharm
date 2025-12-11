'use client'

import { Search, Bell, User } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

export default function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const { t, lang } = useLanguage()
  
  const notifications = [
    { id: 1, message: lang === 'ru' ? 'Мало товара: Парацетамол' : lang === 'uz' ? 'Kam qoldi: Paratsetamol' : 'Low stock: Paracetamol', type: 'warning' },
    { id: 2, message: lang === 'ru' ? 'Истекает срок: Аспирин (5 дней)' : lang === 'uz' ? 'Muddati tugaydi: Aspirin (5 kun)' : 'Expiring: Aspirin (5 days)', type: 'danger' },
  ]

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
              {notifications.length > 0 && (
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
                  {notifications.length}
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
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </header>
  )
}
