'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useLanguage } from '@/lib/LanguageContext'

interface TopRankingData {
    rank: number
    name: string
    count: number
    share: number
}

interface TopRankingChartProps {
    data: TopRankingData[]
    title?: string
    height?: number
    showRank?: boolean
    color?: string
}

const GRADIENT_COLORS = [
    '#6366f1', '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd',
    '#ddd6fe', '#e0e7ff', '#eef2ff', '#f5f5ff', '#fafafa'
]

export default function TopRankingChart({
    data,
    title,
    height = 350,
    showRank = true,
    color = '#6366f1'
}: TopRankingChartProps) {
    const { lang } = useLanguage()

    const chartData = data.slice(0, 10).map((item, index) => ({
        ...item,
        displayName: item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name,
        fill: GRADIENT_COLORS[Math.min(index, GRADIENT_COLORS.length - 1)],
    }))

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
                    <p style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                        #{data.rank} {data.name}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {lang === 'ru' ? 'Количество' : lang === 'uz' ? 'Miqdor' : 'Count'}: <strong>{data.count}</strong>
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {lang === 'ru' ? 'Доля' : lang === 'uz' ? 'Ulush' : 'Share'}: <strong>{data.share.toFixed(2)}%</strong>
                    </p>
                </div>
            )
        }
        return null
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
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                        <XAxis
                            type="number"
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                        />
                        <YAxis
                            type="category"
                            dataKey="displayName"
                            stroke="#64748b"
                            fontSize={11}
                            width={150}
                            tickLine={false}
                            tickFormatter={(value, index) => showRank ? `${index + 1}. ${value}` : value}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="count"
                            radius={[0, 4, 4, 0]}
                            maxBarSize={30}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
