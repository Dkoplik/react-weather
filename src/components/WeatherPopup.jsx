import { getWeatherInfo } from '../utils/weatherCodes'
import TemperatureChart from './TemperatureChart'

export default function WeatherPopup({ placeName, weather, loading, error }) {
	if (loading) return <div style={{ minWidth: 240 }}>Загрузка погоды…</div>
	if (error) return <div style={{ minWidth: 240, color: '#b00020' }}>{error}</div>
	if (!weather) return <div style={{ minWidth: 240 }}>Выберите точку на карте</div>

	const current = weather.current
	const info = getWeatherInfo(current.weather_code)

	return (
		<div style={{ minWidth: 260, fontFamily: 'system-ui, sans-serif' }}>
			<h4 style={{ margin: '0 0 4px', fontSize: 14, lineHeight: 1.3 }}>{placeName}</h4>

			<div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0' }}>
				<span style={{ fontSize: 32 }}>{info.emoji}</span>
				<div>
					<div style={{ fontSize: 24, fontWeight: 700 }}>
						{Math.round(current.temperature_2m)}°C
					</div>
					<div style={{ fontSize: 12, color: '#555' }}>{info.label}</div>
				</div>
			</div>

			<div style={{ fontSize: 12, color: '#444', display: 'grid', gap: 2 }}>
				<span>Ощущается как: {Math.round(current.apparent_temperature)}°C</span>
				<span>Влажность: {current.relative_humidity_2m}%</span>
				<span>Ветер: {current.wind_speed_10m} км/ч</span>
			</div>

			<TemperatureChart
				hourlyTimes={weather.hourly?.time}
				hourlyTemps={weather.hourly?.temperature_2m}
			/>
		</div>
	)
}