import { useMemo } from 'react'
import Supercluster from 'supercluster'
import { Squirrel } from '../types'

type ClusterPoint = {
  type: 'Feature'
  properties: {
    cluster: boolean
    squirrelId: string
    squirrel: Squirrel
  }
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
}

const useSquirrelClusters = (
  squirrels: Squirrel[],
  bounds: [number, number, number, number],
  zoom: number
) => {
  const supercluster = useMemo(() => {
    const cluster = new Supercluster<ClusterPoint['properties']>({
      radius: 75,
      maxZoom: 17,
    })

    const points: ClusterPoint[] = squirrels.map((squirrel) => ({
      type: 'Feature',
      properties: {
        cluster: false,
        squirrelId: squirrel.id,
        squirrel,
      },
      geometry: {
        type: 'Point',
        coordinates: [squirrel.longitude, squirrel.latitude],
      },
    }))

    cluster.load(points)
    return cluster
  }, [squirrels])

  const clusters = useMemo(() => {
    return supercluster.getClusters(bounds, Math.floor(zoom))
  }, [supercluster, bounds, zoom])

  const getClusterExpansionZoom = (clusterId: number) => {
    return supercluster.getClusterExpansionZoom(clusterId)
  }

  return { clusters, getClusterExpansionZoom }
}

export default useSquirrelClusters

