import { useRef, useState, useEffect } from 'react'
import Map, { NavigationControl, Marker, MapRef } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import styles from './SquirrelMap.module.css'
import { Squirrel } from '../types'
import { getSquirrels } from '../services/api'
import useSquirrelClusters from '../hooks/useSquirrelClusters'

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
  const mapRef = useRef<MapRef>(null)
  const [squirrels, setSquirrels] = useState<Squirrel[]>([])
  const [loading, setLoading] = useState(true)
  const [bounds, setBounds] = useState<[number, number, number, number]>([
    -73.99, 40.76, -73.94, 40.805,
  ])
  const [zoom, setZoom] = useState(16)

  useEffect(() => {
    const loadSquirrels = async () => {
      try {
        const data = await getSquirrels()
        setSquirrels(data)
      } catch (error) {
        console.error('Error loading squirrels:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSquirrels()
  }, [])

  const { clusters, getClusterExpansionZoom } = useSquirrelClusters(
    squirrels,
    bounds,
    zoom
  )

  const handleMapMove = () => {
    const map = mapRef.current
    if (!map) return

    const mapBounds = map.getBounds()
    const newBounds: [number, number, number, number] = [
      mapBounds.getWest(),
      mapBounds.getSouth(),
      mapBounds.getEast(),
      mapBounds.getNorth(),
    ]
    setBounds(newBounds)
    setZoom(map.getZoom())
  }

  const handleClusterClick = (clusterId: number, longitude: number, latitude: number) => {
    const expansionZoom = getClusterExpansionZoom(clusterId)
    mapRef.current?.flyTo({
      center: [longitude, latitude],
      zoom: expansionZoom,
      duration: 500,
    })
  }

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
        onMove={handleMapMove}
        onZoom={handleMapMove}
      >
        <NavigationControl position="top-right" showCompass={false} />
        
        {!loading && clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates
          const { cluster: isCluster, point_count: pointCount } = cluster.properties as any

          if (isCluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                longitude={longitude}
                latitude={latitude}
                anchor="center"
              >
                <div
                  className={styles.clusterMarker}
                  style={{
                    width: `${30 + (pointCount / squirrels.length) * 40}px`,
                    height: `${30 + (pointCount / squirrels.length) * 40}px`,
                  }}
                  onClick={() => handleClusterClick(cluster.id as number, longitude, latitude)}
                >
                  {pointCount}
                </div>
              </Marker>
            )
          }

          const squirrel = (cluster.properties as any).squirrel as Squirrel
          return (
            <Marker
              key={`squirrel-${squirrel.id}`}
              longitude={longitude}
              latitude={latitude}
              anchor="bottom"
            >
              <div className={styles.marker}>🐿️</div>
            </Marker>
          )
        })}
      </Map>
    </div>
  )
}

export default SquirrelMap
