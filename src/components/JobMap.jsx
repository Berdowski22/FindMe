import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import icon2x from 'leaflet/dist/images/marker-icon-2x.png'
import shadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet'
import { useEffect } from 'react'

const jobIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: icon2x,
  shadowUrl: shadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})
const meIcon = L.divIcon({ className: 'me-marker', iconSize: [18, 18] })

function Recenter({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    map.setView([center.lat, center.lng], zoom)
  }, [map, center.lat, center.lng, zoom])
  return null
}

function ClickPicker({ onPick }) {
  useMapEvents({ click: (e) => onPick?.({ lat: e.latlng.lat, lng: e.latlng.lng }) })
  return null
}

export default function JobMap({ center, radius, jobs = [], onSelect, onPick, pin, height = 420 }) {
  const zoom = radius ? (radius <= 1000 ? 15 : radius <= 3000 ? 14 : 13) : 12

  return (
    <MapContainer center={[center.lat, center.lng]} zoom={zoom} style={{ height }} className="rounded border">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter center={center} zoom={zoom} />
      <ClickPicker onPick={onPick} />
      {radius && <Circle center={[center.lat, center.lng]} radius={radius} pathOptions={{ color: '#0d6efd' }} />}
      {!pin && !onPick && <Marker position={[center.lat, center.lng]} icon={meIcon}><Popup>Konumunuz</Popup></Marker>}
      {pin && <Marker position={[pin.lat, pin.lng]} icon={jobIcon} />}
      {jobs.map((j) => (
        <Marker key={j.id} position={[j.lat, j.lng]} icon={jobIcon} eventHandlers={{ click: () => onSelect?.(j) }}>
          <Popup>
            <strong>{j.title}</strong>
            <br />
            {j.company}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
