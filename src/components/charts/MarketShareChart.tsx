'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { useLanguage } from '@/lib/LanguageContext'

interface MarketShareData {
    name: string
    count: number
    shareByQuantity: number
}

interface MarketShareChartProps {
    data: MarketShareData[]
    title?: string
    showLegend?: boolean
    height?: number
}

const COLORS = [
    '#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe',
    '#10b981', '#34d399', '#6ee7b7', '#a7f3d0',
    '#f59e0b', '#fbbf24', '#fcd34d',
    '#ef4444', '#f87171', '#fca5a5',
]

export default function MarketShareChart({
    data,
    title,
    showLegend = true,
    height = 300
}: MarketShareChartProps) {
    const { lang, formatCurrency } = useLanguage()

    const chartData = data.slice(0, 10).map((item, index) => ({
        name: item.name,
        value: item.count,
        share: item.shareByQuantity,
        fill: COLORS[index % COLORS.length],
    }))

    // Add "Others" if there are more than 10 items
    if (data.length > 10) {
        const othersCount = data.slice(10).reduce((sum, item) => sum + item.count, 0)
        const othersShare = data.slice(10).reduce((sum, item) => sum + item.shareByQuantity, 0)
        chartData.push({
            name: lang === 'ru' ? 'Прочие' : lang === 'uz' ? 'Boshqalar' : 'Others',
            value: othersCount,
            share: othersShare,
            fill: '#94a3b8',
        })
    }

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                    <p style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{data.name}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {lang === 'ru' ? 'Количество' : lang === 'uz' ? 'Miqdor' : 'Count'}: <strong>{data.value}</strong>
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {lang === 'ru' ? 'Доля' : lang === 'uz' ? 'Ulush' : 'Share'}: <strong>{data.share.toFixed(1)}%</strong>
                    </p>
                </div>
            )
        }
        return null
    }

    const renderLegend = (props: any) => {
        const { payload } = props
        return (
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                justifyContent: 'center',
                marginTop: '1rem',
                fontSize: '0.75rem'
            }}>
                {payload.map((entry: any, index: number) => (
                    <div key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '3px',
                            background: entry.color
                        }} />
                        <span style={{ color: 'var(--text-secondary)' }}>
                            {entry.value.length > 15 ? entry.value.substring(0, 15) + '...' : entry.value}
                        </span>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div>
            {title && (
                <h4 style={{ marginBottom: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {title}
                </h4>
            )}
            <div style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, share }) => share > 5 ? `${share.toFixed(0)}%` : ''}
                            labelLine={false}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        {showLegend && <Legend content={renderLegend} />}
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
