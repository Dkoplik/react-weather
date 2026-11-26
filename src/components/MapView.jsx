import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import WeatherPopup from './WeatherPopup'
import { fetchLatestRadarTileUrl } from '../services/api'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
	iconRetinaUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png',
	iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png',
	shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function ClickHandler({ onMapClick }) {
	useMapEvents({
		click(e) {
			onMapClick(e.latlng)
		},
	})
	return null
}

function RadarLayer({ visible }) {
	const map = useMap()
	const layerRef = useRef(null)

	useEffect(() => {
		if (!visible) {
			if (layerRef.current) {
				map.removeLayer(layerRef.current)
				layerRef.current = null
			}
			return
		}

		let cancelled = false

		fetchLatestRadarTileUrl()
			.then(({ tileUrl }) => {
				if (cancelled) return
				layerRef.current = L.tileLayer(tileUrl, {
					opacity: 0.6,
					attribution: 'Radar data © <a href="https://www.rainviewer.com/">RainViewer</a>',
				})
				layerRef.current.addTo(map)
			})
			.catch((err) => {
				console.error('Radar layer error:', err)
			})

		return () => {
			cancelled = true
			if (layerRef.current) {
				map.removeLayer(layerRef.current)
				layerRef.current = null
			}
		}
	}, [visible, map])

	return null
}

export default function MapView({
	center,
	markerPosition,
	placeName,
	weather,
	loading,
	error,
	onMapClick,
	showRadar,
}) {
	return (
		<MapContainer
			center={center}
			zoom={6}
			style={{ height: '100%', width: '100%', borderRadius: 12 }}
			scrollWheelZoom
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>

			<RadarLayer visible={showRadar} />

			<ClickHandler onMapClick={onMapClick} />

			{markerPosition && (
				<Marker position={markerPosition}>
					<Popup autoPan>
						<WeatherPopup
							placeName={placeName}
							weather={weather}
							loading={loading}
							error={error}
						/>
					</Popup>
				</Marker>
			)}
		</MapContainer>
	)
}