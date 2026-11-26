import { useMemo } from 'react'

const W = 260
const H = 80
const PAD = 10

export default function TemperatureChart({ hourlyTimes = [], hourlyTemps = [] }) {
	const { path, area, min, max, points } = useMemo(() => {
		const temps = hourlyTemps.slice(0, 24).filter((t) => t != null)
		if (temps.length < 2) return { path: '', area: '', min: 0, max: 0, points: [] }

		const minT = Math.min(...temps)
		const maxT = Math.max(...temps)
		const span = Math.max(maxT - minT, 1)

		const pts = temps.map((t, i) => {
			const x = PAD + (i / (temps.length - 1)) * (W - PAD * 2)
			const y = H - PAD - ((t - minT) / span) * (H - PAD * 2)
			return { x, y, t }
		})

		const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
		const areaPath = `${line} L ${pts[pts.length - 1].x} ${H - PAD} L ${pts[0].x} ${H - PAD} Z`

		return { path: line, area: areaPath, min: minT, max: maxT, points: pts }
	}, [hourlyTemps])

	if (!path) return <p style={{ fontSize: 12, color: '#888' }}>Нет данных для графика</p>

	return (
		<div style={{ marginTop: 8 }}>
			<svg width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
				<defs>
					<linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#4f8cff" stopOpacity="0.5" />
						<stop offset="100%" stopColor="#4f8cff" stopOpacity="0.05" />
					</linearGradient>
				</defs>
				<path d={area} fill="url(#tempGrad)" />
				<path d={path} fill="none" stroke="#2f6fed" strokeWidth="2" strokeLinecap="round" />
				<text x={PAD} y={12} fontSize="10" fill="#555">
					{max.toFixed(0)}°
				</text>
				<text x={PAD} y={H} fontSize="10" fill="#555">
					{min.toFixed(0)}°
				</text>
			</svg>
			<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#888' }}>
				{hourlyTimes.filter((_, i) => i % 6 === 0).map((t) => (
					<span key={t}>{t.split('T')[1]}</span>
				))}
			</div>
		</div>
	)
}