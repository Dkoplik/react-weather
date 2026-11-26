const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const OPEN_METEO_BASE = "https://api.open-meteo.com/v1";

/**
 * Обратное геокодирование
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<string>}
 */
export async function reverseGeocode(lat, lon) {
  const url = new URL(`${NOMINATIM_BASE}/reverse`);
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("format", "json");
  url.searchParams.set("zoom", "10");
  url.searchParams.set("accept-language", "ru");

  const res = await fetch(url.toString(), {
    headers: {},
  });

  if (!res.ok) throw new Error("Не удалось определить адрес");
  const data = await res.json();
  return data.display_name ?? `${lat.toFixed(3)}, ${lon.toFixed(3)}`;
}

/**
 * Прогноз погоды из Open-Meteo.
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<object>}
 */
export async function fetchWeather(lat, lon) {
  const url = new URL(`${OPEN_METEO_BASE}/forecast`);
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lon);
  url.searchParams.set(
    "current",
    [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "wind_speed_10m",
      "weather_code",
    ].join(","),
  );
  url.searchParams.set("hourly", "temperature_2m");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "1");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Не удалось загрузить погоду");
  return res.json();
}

const RAINVIEWER_MANIFEST =
  "https://api.rainviewer.com/public/weather-maps.json";

/**
 * Возвращает URL-шаблон тайлов последнего доступного радарного кадра.
 * @returns {Promise<{ tileUrl: string, time: number }>}
 */
export async function fetchLatestRadarTileUrl() {
  const res = await fetch(RAINVIEWER_MANIFEST);
  if (!res.ok) throw new Error("Не удалось загрузить данные радара");

  const data = await res.json();
  const host = data.host;
  const past = data.radar?.past ?? [];
  if (past.length === 0) throw new Error("Нет доступных радарных кадров");

  const latest = past[past.length - 1];
  const tileUrl = `${host}${latest.path}/256/{z}/{x}/{y}/2/1_1.png`;
  return { tileUrl, time: latest.time };
}
