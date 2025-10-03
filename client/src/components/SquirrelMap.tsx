import { useRef } from 'react'
import Map, { NavigationControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import styles from './SquirrelMap.module.css'

const CENTRAL_PARK_CENTER = {
  longitude: -73.9665,
  latitude: 40.7829,
}

const CENTRAL_PARK_BOUNDS: [[number, number], [number, number]] = [
  [-73.9900, 40.7600],
  [-73.9400, 40.8050],
]

const MAP_STYLE = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm-tiles-layer',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
}

const SquirrelMap = () => {
  const mapRef = useRef<any>(null)

  return (
    <div className={styles.mapContainer}>
      <Map
        ref={mapRef}
        initialViewState={{
          ...CENTRAL_PARK_CENTER,
          zoom: 16,
          bearing: 119,
          pitch: 0,
        }}
        minZoom={14.2}
        maxZoom={18}
        maxBounds={CENTRAL_PARK_BOUNDS}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
        scrollZoom={true}
        dragPan={true}
        dragRotate={false}
        touchZoomRotate={false}
      >
        <NavigationControl position="top-right" showCompass={false} />
      </Map>
    </div>
  )
}

export default SquirrelMap
