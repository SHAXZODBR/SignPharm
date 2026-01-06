'use client'

import { AlertTriangle } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

interface ConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    isLoading?: boolean
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    cancelText,
    isLoading = false
}: ConfirmDialogProps) {
    const { t } = useLanguage()

    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal confirm-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="modal-body">
                    <div className="confirm-icon danger">
                        <AlertTriangle size={32} />
                    </div>
                    <h3 className="confirm-title">{title}</h3>
                    <p className="confirm-message">{message}</p>
                    <div className="confirm-actions">
                        <button
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            {cancelText || t('cancel')}
                        </button>
                        <button
                            className={`btn btn-danger ${isLoading ? 'btn-loading' : ''}`}
                            onClick={onConfirm}
                            disabled={isLoading}
                        >
                            {confirmText || t('delete')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
