import { useCallback, useState } from 'react'
import MapView from './components/MapView'
import { reverseGeocode, fetchWeather } from './services/api'

const DEFAULT_CENTER = [47.22664832828708, 39.71557617187] // Ростов-на-Дону

export default function App() {
  const [markerPosition, setMarkerPosition] = useState(null)
  const [placeName, setPlaceName] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadWeatherForPoint = useCallback(async (latlng) => {
    const { lat, lng } = latlng
    setMarkerPosition([lat, lng])
    setLoading(true)
    setError('')
    setWeather(null)

    try {
      const name = await reverseGeocode(lat, lng)
      setPlaceName(name)

      const data = await fetchWeather(lat, lng)
      setWeather(data)
    } catch (err) {
      setError(err.message || 'Что-то пошло не так')
      setPlaceName(`${lat.toFixed(3)}, ${lng.toFixed(3)}`)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setError('Геолокация не поддерживается браузером')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        loadWeatherForPoint({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
      },
      () => setError('Не удалось получить ваше местоположение'),
      { enableHighAccuracy: false, timeout: 10000 }
    )
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif' }}>
      <header
        style={{
          padding: '10px 16px',
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          background: '#fff',
          borderBottom: '1px solid #e5e5e5',
          zIndex: 10,
        }}
      >
        <h1 style={{ fontSize: 16, margin: 0, flex: 1 }}>🌍 Погода на карте</h1>
        <button
          onClick={handleLocateMe}
          style={{
            padding: '6px 12px',
            borderRadius: 8,
            border: '1px solid #ccc',
            background: '#f8f8f8',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          📍 Моё местоположение
        </button>
      </header>

      <main style={{ flex: 1, position: 'relative' }}>
        <MapView
          center={markerPosition ?? DEFAULT_CENTER}
          markerPosition={markerPosition}
          placeName={placeName}
          weather={weather}
          loading={loading}
          error={error}
          onMapClick={loadWeatherForPoint}
        />
        {error && (
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#fff3f3',
              color: '#b00020',
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: 13,
              boxShadow: '0 2px 8px rgba(0,0,0,.12)',
              zIndex: 1000,
            }}
          >
            {error}
          </div>
        )}
      </main>
    </div>
  )
}