import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import WeatherPopup from './WeatherPopup'

// Фикс дефолтных иконок Leaflet под Vite
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

export default function MapView({
	center,
	markerPosition,
	placeName,
	weather,
	loading,
	error,
	onMapClick,
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