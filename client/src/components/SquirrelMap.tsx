import { useRef, useState, useEffect, useMemo } from 'react'
import Map, { NavigationControl, Marker, Popup, MapRef, MapLayerMouseEvent } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import styles from './SquirrelMap.module.css'
import { Squirrel } from '../types'
import { getSquirrels } from '../services/api'
import useSquirrelClusters from '../hooks/useSquirrelClusters'
import SquirrelModal from './SquirrelModal'
import SquirrelFormModal from './SquirrelFormModal'
import SquirrelTooltip from './SquirrelTooltip'
import FilterPanel, { FilterState } from './FilterPanel'

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
  const [selectedSquirrel, setSelectedSquirrel] = useState<Squirrel | null>(null)
  const [hoveredSquirrel, setHoveredSquirrel] = useState<Squirrel | null>(null)
  const [newSquirrelCoords, setNewSquirrelCoords] = useState<{ latitude: number; longitude: number } | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    shift: new Set(),
    age: new Set(),
    primaryFurColor: new Set(),
    highlightFurColor: new Set(),
    location: new Set(),
    activities: new Set(),
    sounds: new Set(),
    tailBehaviors: new Set(),
    interactions: new Set(),
  })

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

  const filteredSquirrels = useMemo(() => {
    return squirrels.filter(squirrel => {
      if (filters.shift.size > 0 && !filters.shift.has(squirrel.shift)) {
        return false
      }

      if (filters.age.size > 0 && (!squirrel.age || !filters.age.has(squirrel.age))) {
        return false
      }

      if (filters.primaryFurColor.size > 0 && 
          (!squirrel.primaryFurColor || !filters.primaryFurColor.has(squirrel.primaryFurColor))) {
        return false
      }

      if (filters.highlightFurColor.size > 0 && 
          (!squirrel.highlightFurColor || !filters.highlightFurColor.has(squirrel.highlightFurColor))) {
        return false
      }

      if (filters.location.size > 0 && 
          (!squirrel.location || !filters.location.has(squirrel.location))) {
        return false
      }

      if (filters.activities.size > 0) {
        const hasActivity = Array.from(filters.activities).some(activity => 
          squirrel[activity as keyof Squirrel] === true
        )
        if (!hasActivity) return false
      }

      if (filters.sounds.size > 0) {
        const hasSound = Array.from(filters.sounds).some(sound => 
          squirrel[sound as keyof Squirrel] === true
        )
        if (!hasSound) return false
      }

      if (filters.tailBehaviors.size > 0) {
        const hasTailBehavior = Array.from(filters.tailBehaviors).some(behavior => 
          squirrel[behavior as keyof Squirrel] === true
        )
        if (!hasTailBehavior) return false
      }

      if (filters.interactions.size > 0) {
        const hasInteraction = Array.from(filters.interactions).some(interaction => 
          squirrel[interaction as keyof Squirrel] === true
        )
        if (!hasInteraction) return false
      }

      return true
    })
  }, [squirrels, filters])

  const { clusters, getClusterExpansionZoom } = useSquirrelClusters(
    filteredSquirrels,
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

  const handleMapClick = (event: MapLayerMouseEvent) => {
    const features = event.features
    if (features && features.length > 0) {
      return
    }

    const { lng, lat } = event.lngLat
    setNewSquirrelCoords({ latitude: lat, longitude: lng })
  }

  const handleSquirrelCreated = async () => {
    try {
      const data = await getSquirrels()
      setSquirrels(data)
    } catch (error) {
      console.error('Error reloading squirrels:', error)
    }
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
        onClick={handleMapClick}
        interactiveLayerIds={[]}
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
                    width: `${30 + (pointCount / filteredSquirrels.length) * 40}px`,
                    height: `${30 + (pointCount / filteredSquirrels.length) * 40}px`,
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
              <div 
                className={styles.marker}
                onClick={() => setSelectedSquirrel(squirrel)}
                onMouseEnter={() => setHoveredSquirrel(squirrel)}
                onMouseLeave={() => setHoveredSquirrel(null)}
              >
                🐿️
              </div>
            </Marker>
          )
        })}

        {hoveredSquirrel && (
          <Popup
            longitude={hoveredSquirrel.longitude}
            latitude={hoveredSquirrel.latitude}
            anchor="top"
            closeButton={false}
            closeOnClick={false}
            offset={15}
            className={styles.popup}
          >
            <SquirrelTooltip squirrel={hoveredSquirrel} />
          </Popup>
        )}
      </Map>
      
      <SquirrelModal 
        squirrel={selectedSquirrel} 
        onClose={() => setSelectedSquirrel(null)} 
      />

      {newSquirrelCoords && (
        <SquirrelFormModal
          latitude={newSquirrelCoords.latitude}
          longitude={newSquirrelCoords.longitude}
          onClose={() => setNewSquirrelCoords(null)}
          onSuccess={handleSquirrelCreated}
        />
      )}
      
      <FilterPanel 
        squirrels={squirrels}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  )
}

export default SquirrelMap
