'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Pill, 
  Package, 
  Building2, 
  Truck, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  ChevronDown,
  Globe
} from 'lucide-react'
import { useState } from 'react'
import { useLanguage, Language, TranslationKey } from '@/lib/LanguageContext'

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'dashboard' as TranslationKey },
  { href: '/drugs', icon: Pill, label: 'drugs' as TranslationKey },
  { href: '/inventory', icon: Package, label: 'inventory' as TranslationKey },
  { href: '/pharmacies', icon: Building2, label: 'pharmacies' as TranslationKey },
  { href: '/suppliers', icon: Truck, label: 'suppliers' as TranslationKey },
  { href: '/sales', icon: ShoppingCart, label: 'sales' as TranslationKey },
  { href: '/analytics', icon: BarChart3, label: 'analytics' as TranslationKey },
  { href: '/settings', icon: Settings, label: 'settings' as TranslationKey },
]

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'uz', name: "O'zbek", flag: '🇺🇿' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { lang, setLang, t } = useLanguage()
  const [langMenuOpen, setLangMenuOpen] = useState(false)

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">P</div>
          <span className="logo-text">PharmaCentral</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="nav-section-title">{t('menu')}</span>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="nav-item-icon" />
                <span>{t(item.label)}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Language Selector */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={16} />
              {languages.find(l => l.code === lang)?.flag} {languages.find(l => l.code === lang)?.name}
            </span>
            <ChevronDown size={16} style={{ 
              transform: langMenuOpen ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.2s ease'
            }} />
          </button>
          
          {langMenuOpen && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: 0,
              right: 0,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              marginBottom: '0.5rem',
              overflow: 'hidden',
              zIndex: 100,
              animation: 'fadeIn 0.2s ease'
            }}>
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    setLang(language.code)
                    setLangMenuOpen(false)
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: lang === language.code ? 'var(--primary-light)' : 'transparent',
                    border: 'none',
                    color: lang === language.code ? 'var(--primary)' : 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (lang !== language.code) {
                      e.currentTarget.style.background = 'var(--surface-hover)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (lang !== language.code) {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  {language.flag} {language.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </aside>
  )
}
