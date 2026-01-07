'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, Pill, Search, X } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

interface ATXNode {
    code: string
    name: string
    nameRu: string
    nameUz?: string
    level: number
    childCount?: number
    parentCode?: string
}

interface ATXTreeSelectorProps {
    value?: string
    onChange: (code: string, node: ATXNode | null) => void
    placeholder?: string
    showSearch?: boolean
}

export default function ATXTreeSelector({
    value,
    onChange,
    placeholder,
    showSearch = true,
}: ATXTreeSelectorProps) {
    const { lang } = useLanguage()
    const [isOpen, setIsOpen] = useState(false)
    const [level1, setLevel1] = useState<ATXNode[]>([])
    const [level2, setLevel2] = useState<Record<string, ATXNode[]>>({})
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedNode, setSelectedNode] = useState<ATXNode | null>(null)

    useEffect(() => {
        fetchLevel1()
    }, [])

    const fetchLevel1 = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/atx?level=1')
            if (res.ok) {
                const data = await res.json()
                setLevel1(data)
            }
        } catch (error) {
            console.error('Failed to fetch ATX level 1:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchLevel2 = async (parentCode: string) => {
        if (level2[parentCode]) return // Already loaded

        try {
            const res = await fetch(`/api/atx?level=2&parent=${parentCode}`)
            if (res.ok) {
                const data = await res.json()
                setLevel2(prev => ({ ...prev, [parentCode]: data }))
            }
        } catch (error) {
            console.error('Failed to fetch ATX level 2:', error)
        }
    }

    const toggleExpand = (code: string) => {
        const newExpanded = new Set(expandedNodes)
        if (newExpanded.has(code)) {
            newExpanded.delete(code)
        } else {
            newExpanded.add(code)
            fetchLevel2(code)
        }
        setExpandedNodes(newExpanded)
    }

    const selectNode = (node: ATXNode) => {
        setSelectedNode(node)
        onChange(node.code, node)
        setIsOpen(false)
    }

    const clearSelection = () => {
        setSelectedNode(null)
        onChange('', null)
    }

    const getNodeName = (node: ATXNode) => {
        if (lang === 'ru') return node.nameRu || node.name
        if (lang === 'uz') return node.nameUz || node.name
        return node.name
    }

    const filteredLevel1 = searchQuery
        ? level1.filter(node =>
            node.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            node.nameRu?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : level1

    const labels = {
        placeholder: placeholder || (lang === 'ru' ? 'Выберите ATX группу' : lang === 'uz' ? 'ATX guruhini tanlang' : 'Select ATX group'),
        search: lang === 'ru' ? 'Поиск...' : lang === 'uz' ? 'Qidirish...' : 'Search...',
        noResults: lang === 'ru' ? 'Не найдено' : lang === 'uz' ? 'Topilmadi' : 'No results',
    }

    return (
        <div style={{ position: 'relative' }}>
            {/* Selected value display */}
            <div
                className="form-input"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    minHeight: '42px',
                }}
            >
                {selectedNode ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                        <span className="badge badge-primary" style={{ fontFamily: 'monospace' }}>
                            {selectedNode.code}
                        </span>
                        <span style={{ fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {getNodeName(selectedNode)}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                clearSelection()
                            }}
                            className="btn btn-icon btn-ghost"
                            style={{ marginLeft: 'auto', padding: '0.25rem' }}
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <span style={{ color: 'var(--text-muted)' }}>{labels.placeholder}</span>
                )}
                <ChevronDown size={16} style={{ color: 'var(--text-muted)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '0.25rem',
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '10px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                        zIndex: 100,
                        maxHeight: '400px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {/* Search */}
                    {showSearch && (
                        <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                            <div className="search-input" style={{ width: '100%' }}>
                                <Search className="search-input-icon" size={16} />
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder={labels.search}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ paddingLeft: '2.25rem', fontSize: '0.875rem' }}
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}

                    {/* Tree */}
                    <div style={{ overflow: 'auto', flex: 1 }}>
                        {loading ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                {lang === 'ru' ? 'Загрузка...' : 'Loading...'}
                            </div>
                        ) : filteredLevel1.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                {labels.noResults}
                            </div>
                        ) : (
                            <div style={{ padding: '0.5rem' }}>
                                {filteredLevel1.map(node => (
                                    <div key={node.code}>
                                        {/* Level 1 node */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '0.5rem 0.75rem',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                transition: 'background 0.15s',
                                                background: selectedNode?.code === node.code ? 'var(--primary-light)' : 'transparent',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (selectedNode?.code !== node.code) {
                                                    e.currentTarget.style.background = 'var(--surface-hover)'
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (selectedNode?.code !== node.code) {
                                                    e.currentTarget.style.background = 'transparent'
                                                }
                                            }}
                                        >
                                            {/* Expand button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    toggleExpand(node.code)
                                                }}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    padding: '0.25rem',
                                                    cursor: 'pointer',
                                                    color: 'var(--text-muted)',
                                                    marginRight: '0.25rem',
                                                }}
                                            >
                                                {expandedNodes.has(node.code) ? (
                                                    <ChevronDown size={16} />
                                                ) : (
                                                    <ChevronRight size={16} />
                                                )}
                                            </button>

                                            {/* Node content */}
                                            <div onClick={() => selectNode(node)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                                                <span style={{
                                                    background: 'var(--primary)',
                                                    color: 'white',
                                                    padding: '0.125rem 0.5rem',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    fontFamily: 'monospace',
                                                }}>
                                                    {node.code}
                                                </span>
                                                <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                                    {getNodeName(node)}
                                                </span>
                                                {node.childCount && (
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                                                        ({node.childCount})
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Level 2 children */}
                                        {expandedNodes.has(node.code) && level2[node.code] && (
                                            <div style={{ marginLeft: '1.5rem', borderLeft: '1px solid var(--border)', paddingLeft: '0.5rem' }}>
                                                {level2[node.code].map(child => (
                                                    <div
                                                        key={child.code}
                                                        onClick={() => selectNode(child)}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            padding: '0.375rem 0.75rem',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            transition: 'background 0.15s',
                                                            background: selectedNode?.code === child.code ? 'var(--primary-light)' : 'transparent',
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (selectedNode?.code !== child.code) {
                                                                e.currentTarget.style.background = 'var(--surface-hover)'
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            if (selectedNode?.code !== child.code) {
                                                                e.currentTarget.style.background = 'transparent'
                                                            }
                                                        }}
                                                    >
                                                        <span style={{
                                                            background: 'var(--primary-light)',
                                                            color: 'var(--primary)',
                                                            padding: '0.125rem 0.375rem',
                                                            borderRadius: '4px',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 600,
                                                            fontFamily: 'monospace',
                                                        }}>
                                                            {child.code}
                                                        </span>
                                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                            {getNodeName(child)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
