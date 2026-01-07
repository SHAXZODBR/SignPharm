'use client'

import { useState } from 'react'
import { Download, FileSpreadsheet, FileText, Loader2, X } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

interface ExportButtonProps {
    data: any[]
    filename?: string
    columns?: { key: string; label: string }[]
}

export default function ExportButton({ data, filename = 'export', columns }: ExportButtonProps) {
    const { lang } = useLanguage()
    const [showModal, setShowModal] = useState(false)
    const [exporting, setExporting] = useState(false)
    const [format, setFormat] = useState<'csv' | 'json'>('csv')

    const labels = {
        export: lang === 'ru' ? 'Экспорт' : lang === 'uz' ? 'Eksport' : 'Export',
        exportData: lang === 'ru' ? 'Экспорт данных' : lang === 'uz' ? "Ma'lumotlarni eksport qilish" : 'Export Data',
        format: lang === 'ru' ? 'Формат' : lang === 'uz' ? 'Format' : 'Format',
        records: lang === 'ru' ? 'записей' : lang === 'uz' ? 'yozuvlar' : 'records',
        cancel: lang === 'ru' ? 'Отмена' : lang === 'uz' ? 'Bekor qilish' : 'Cancel',
        download: lang === 'ru' ? 'Скачать' : lang === 'uz' ? 'Yuklab olish' : 'Download',
    }

    const exportToCSV = () => {
        if (!data.length) return

        const headers = columns?.map(c => c.label) || Object.keys(data[0])
        const keys = columns?.map(c => c.key) || Object.keys(data[0])

        const csvContent = [
            headers.join(','),
            ...data.map(row =>
                keys.map(key => {
                    const value = row[key]
                    // Handle values with commas or quotes
                    if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                        return `"${value.replace(/"/g, '""')}"`
                    }
                    return value ?? ''
                }).join(',')
            )
        ].join('\n')

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
        downloadBlob(blob, `${filename}.csv`)
    }

    const exportToJSON = () => {
        if (!data.length) return

        const jsonContent = JSON.stringify(data, null, 2)
        const blob = new Blob([jsonContent], { type: 'application/json' })
        downloadBlob(blob, `${filename}.json`)
    }

    const downloadBlob = (blob: Blob, name: string) => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    }

    const handleExport = async () => {
        setExporting(true)
        await new Promise(resolve => setTimeout(resolve, 500)) // Small delay for UX

        if (format === 'csv') {
            exportToCSV()
        } else {
            exportToJSON()
        }

        setExporting(false)
        setShowModal(false)
    }

    return (
        <>
            <button className="btn btn-secondary" onClick={() => setShowModal(true)}>
                <Download size={16} />
                {labels.export}
            </button>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{labels.exportData}</h3>
                            <button className="btn btn-icon btn-ghost" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">{labels.format}</label>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button
                                        className={`btn ${format === 'csv' ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => setFormat('csv')}
                                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    >
                                        <FileSpreadsheet size={18} />
                                        CSV / Excel
                                    </button>
                                    <button
                                        className={`btn ${format === 'json' ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => setFormat('json')}
                                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    >
                                        <FileText size={18} />
                                        JSON
                                    </button>
                                </div>
                            </div>
                            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--surface-hover)', borderRadius: '8px' }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    {data.length} {labels.records}
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>{labels.cancel}</button>
                            <button className="btn btn-primary" onClick={handleExport} disabled={exporting || !data.length}>
                                {exporting ? <Loader2 className="spinner" size={16} /> : <Download size={16} />}
                                {labels.download}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
