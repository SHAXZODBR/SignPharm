'use client'

import Header from '@/components/Header'
import { useLanguage, Language } from '@/lib/LanguageContext'
import { useState } from 'react'
import { Settings as SettingsIcon, Globe, DollarSign, Bell, Users, Database, Shield, Save, RefreshCw } from 'lucide-react'

export default function SettingsPage() {
  const { t, lang, setLang } = useLanguage()
  const [activeTab, setActiveTab] = useState('general')
  const [currency, setCurrency] = useState('UZS')
  const [usdRate, setUsdRate] = useState('12850')
  const [notifications, setNotifications] = useState({ lowStock: true, expiry: true, sales: false, email: true })

  const tabs = [
    { id: 'general', label: t('general'), icon: SettingsIcon },
    { id: 'currency', label: t('currency'), icon: DollarSign },
    { id: 'notifications', label: t('notifications'), icon: Bell },
    { id: 'users', label: t('users'), icon: Users },
    { id: 'database', label: t('database'), icon: Database },
    { id: 'security', label: t('security'), icon: Shield },
  ]

  return (
    <>
      <Header title={t('settings')} subtitle={t('settingsTitle')} />
      <div className="page-content">
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ width: '240px', flexShrink: 0 }}>
            <div className="card">
              <div className="card-body" style={{ padding: '0.5rem' }}>
                {tabs.map(tab => {
                  const Icon = tab.icon
                  return (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', background: activeTab === tab.id ? 'var(--primary-light)' : 'transparent', color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, textAlign: 'left', transition: 'all 0.2s ease' }}><Icon size={18} />{tab.label}</button>
                  )
                })}
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            {activeTab === 'general' && (
              <div className="card">
                <div className="card-header"><h3 className="card-title">{t('generalSettings')}</h3></div>
                <div className="card-body">
                  <div className="form-group"><label className="form-label">{t('organizationName')}</label><input type="text" className="form-input" defaultValue="PharmaCentral" /></div>
                  <div className="form-group">
                    <label className="form-label">{t('interfaceLanguage')}</label>
                    <select className="form-input form-select" value={lang} onChange={(e) => setLang(e.target.value as Language)}>
                      <option value="ru">🇷🇺 Русский</option>
                      <option value="uz">🇺🇿 O'zbek</option>
                      <option value="en">🇬🇧 English</option>
                    </select>
                  </div>
                  <div className="form-group"><label className="form-label">{t('timezone')}</label><select className="form-input form-select"><option value="Asia/Tashkent">{lang === 'ru' ? 'Ташкент' : lang === 'uz' ? 'Toshkent' : 'Tashkent'} (UTC+5)</option></select></div>
                  <div className="form-group"><label className="form-label">{t('dateFormat')}</label><select className="form-input form-select"><option value="DD.MM.YYYY">{lang === 'ru' ? 'ДД.ММ.ГГГГ' : 'DD.MM.YYYY'} (11.12.2025)</option><option value="YYYY-MM-DD">{lang === 'ru' ? 'ГГГГ-ММ-ДД' : 'YYYY-MM-DD'} (2025-12-11)</option></select></div>
                  <div style={{ marginTop: '1.5rem' }}><button className="btn btn-primary"><Save size={16} /> {t('saveChanges')}</button></div>
                </div>
              </div>
            )}

            {activeTab === 'currency' && (
              <div className="card">
                <div className="card-header"><h3 className="card-title">{t('currencySettings')}</h3></div>
                <div className="card-body">
                  <div className="form-group"><label className="form-label">{t('mainCurrency')}</label><select className="form-input form-select" value={currency} onChange={(e) => setCurrency(e.target.value)}><option value="UZS">🇺🇿 {lang === 'ru' ? 'Узбекский сум' : lang === 'uz' ? "O'zbek so'mi" : 'Uzbek Sum'} (UZS)</option><option value="USD">🇺🇸 {lang === 'ru' ? 'Доллар США' : lang === 'uz' ? 'AQSH dollari' : 'US Dollar'} (USD)</option></select></div>
                  <div className="form-group">
                    <label className="form-label">{t('exchangeRate')}</label>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><input type="number" className="form-input" value={usdRate} onChange={(e) => setUsdRate(e.target.value)} style={{ width: '200px' }} /><span style={{ color: 'var(--text-secondary)' }}>1 USD = {usdRate} UZS</span><button className="btn btn-secondary btn-sm"><RefreshCw size={14} /> {t('updateRate')}</button></div>
                  </div>
                  <div style={{ background: 'var(--info-light)', padding: '1rem', borderRadius: '10px', marginTop: '1rem' }}><p style={{ fontSize: '0.9rem', color: 'var(--info)' }}>💡 {t('currencyHint')}</p></div>
                  <div style={{ marginTop: '1.5rem' }}><button className="btn btn-primary"><Save size={16} /> {t('saveChanges')}</button></div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="card">
                <div className="card-header"><h3 className="card-title">{t('notificationSettings')}</h3></div>
                <div className="card-body">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--background-tertiary)', borderRadius: '10px' }}><div><div style={{ fontWeight: 500 }}>{t('lowStockNotification')}</div><div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('lowStockNotificationDesc')}</div></div><input type="checkbox" checked={notifications.lowStock} onChange={(e) => setNotifications({...notifications, lowStock: e.target.checked})} style={{ width: '20px', height: '20px' }} /></label>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--background-tertiary)', borderRadius: '10px' }}><div><div style={{ fontWeight: 500 }}>{t('expiryNotification')}</div><div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('expiryNotificationDesc')}</div></div><input type="checkbox" checked={notifications.expiry} onChange={(e) => setNotifications({...notifications, expiry: e.target.checked})} style={{ width: '20px', height: '20px' }} /></label>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--background-tertiary)', borderRadius: '10px' }}><div><div style={{ fontWeight: 500 }}>{t('largeSalesNotification')}</div><div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('largeSalesNotificationDesc')}</div></div><input type="checkbox" checked={notifications.sales} onChange={(e) => setNotifications({...notifications, sales: e.target.checked})} style={{ width: '20px', height: '20px' }} /></label>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--background-tertiary)', borderRadius: '10px' }}><div><div style={{ fontWeight: 500 }}>{t('emailNotifications')}</div><div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('emailNotificationsDesc')}</div></div><input type="checkbox" checked={notifications.email} onChange={(e) => setNotifications({...notifications, email: e.target.checked})} style={{ width: '20px', height: '20px' }} /></label>
                  </div>
                  <div style={{ marginTop: '1.5rem' }}><button className="btn btn-primary"><Save size={16} /> {t('saveChanges')}</button></div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="card">
                <div className="card-header"><h3 className="card-title">{t('userManagement')}</h3><button className="btn btn-primary btn-sm">{t('addUser')}</button></div>
                <div className="card-body" style={{ padding: 0 }}>
                  <table className="data-table">
                    <thead><tr><th>{t('user')}</th><th>{t('email')}</th><th>{t('role')}</th><th>{t('status')}</th></tr></thead>
                    <tbody>
                      <tr><td style={{ fontWeight: 500 }}>{t('admin')}</td><td>admin@pharma.uz</td><td><span className="badge badge-primary">{t('admin')}</span></td><td><span className="badge badge-success">{t('active')}</span></td></tr>
                      <tr><td style={{ fontWeight: 500 }}>{lang === 'ru' ? 'Иванова А.С.' : 'Ivanova A.S.'}</td><td>ivanova@pharma.uz</td><td><span className="badge badge-info">{t('managerRole')}</span></td><td><span className="badge badge-success">{t('active')}</span></td></tr>
                      <tr><td style={{ fontWeight: 500 }}>{lang === 'ru' ? 'Петров И.В.' : 'Petrov I.V.'}</td><td>petrov@pharma.uz</td><td><span className="badge badge-warning">{t('cashier')}</span></td><td><span className="badge badge-success">{t('active')}</span></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'database' && (
              <div className="card">
                <div className="card-header"><h3 className="card-title">{t('database')}</h3></div>
                <div className="card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'var(--background-tertiary)', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>2,458</div><div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('drugsCount2')}</div></div>
                    <div style={{ background: 'var(--background-tertiary)', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>12,456</div><div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('inventoryRecords')}</div></div>
                    <div style={{ background: 'var(--background-tertiary)', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>45,892</div><div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('transactionsCount')}</div></div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}><button className="btn btn-secondary"><Database size={16} /> {t('backupDatabase')}</button><button className="btn btn-secondary"><RefreshCw size={16} /> {t('restoreDatabase')}</button></div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="card">
                <div className="card-header"><h3 className="card-title">{t('security')}</h3></div>
                <div className="card-body">
                  <div className="form-group"><label className="form-label">{t('currentPassword')}</label><input type="password" className="form-input" placeholder="••••••••" /></div>
                  <div className="form-group"><label className="form-label">{t('newPassword')}</label><input type="password" className="form-input" placeholder={t('minChars')} /></div>
                  <div className="form-group"><label className="form-label">{t('confirmPassword')}</label><input type="password" className="form-input" placeholder={t('repeatPassword')} /></div>
                  <div style={{ marginTop: '1.5rem' }}><button className="btn btn-primary"><Shield size={16} /> {t('updatePassword')}</button></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
