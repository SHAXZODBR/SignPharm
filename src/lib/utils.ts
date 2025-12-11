import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatCurrency(amount: number, currency: string = 'UZS'): string {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getExpiryStatus(expiryDate: Date | string | null): 'expired' | 'warning' | 'ok' {
  if (!expiryDate) return 'ok'
  const expiry = new Date(expiryDate)
  const now = new Date()
  const threeMonths = new Date()
  threeMonths.setMonth(threeMonths.getMonth() + 3)

  if (expiry < now) return 'expired'
  if (expiry < threeMonths) return 'warning'
  return 'ok'
}

export function getStockStatus(quantity: number, minStock: number): 'critical' | 'low' | 'ok' {
  if (quantity <= 0) return 'critical'
  if (quantity <= minStock) return 'low'
  return 'ok'
}

// Exchange rate (can be made dynamic later)
export const USD_RATE = 12850 // UZS per 1 USD

export function convertToUsd(uzs: number): number {
  return uzs / USD_RATE
}

export function convertToUzs(usd: number): number {
  return usd * USD_RATE
}
