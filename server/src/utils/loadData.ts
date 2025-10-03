import { Squirrel } from '../types/index.js'
import * as squirrelRepository from '../repositories/squirrelRepository.js'
import { generateId } from './idGenerator.js'

interface RawSquirrelData {
  x?: string
  y?: string
  unique_squirrel_id?: string
  hectare?: string
  shift?: string
  date?: string
  hectare_squirrel_number?: string
  age?: string
  primary_fur_color?: string
  highlight_fur_color?: string
  combination_of_primary_and_highlight_color?: string
  color_notes?: string
  location?: string
  above_ground_sighter_measurement?: string
  specific_location?: string
  running?: string
  chasing?: string
  climbing?: string
  eating?: string
  foraging?: string
  other_activities?: string
  kuks?: string
  quaas?: string
  moans?: string
  tail_flags?: string
  tail_twitches?: string
  approaches?: string
  indifferent?: string
  runs_from?: string
  other_interactions?: string
  lat_long?: string
}

const parseBoolean = (value?: string | boolean): boolean | undefined => {
  if (value === undefined || value === null || value === '') return undefined
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value.toLowerCase() === 'true'
  return undefined
}

const transformSquirrelData = (raw: RawSquirrelData): Squirrel | null => {
  const latitude = parseFloat(raw.y || '0')
  const longitude = parseFloat(raw.x || '0')
  
  if (!raw.unique_squirrel_id || !raw.hectare || !raw.shift || !raw.date) {
    return null
  }
  
  return {
    id: generateId(),
    latitude,
    longitude,
    uniqueSquirrelId: raw.unique_squirrel_id,
    hectare: raw.hectare,
    shift: raw.shift,
    date: raw.date,
    hectareSquirrelNumber: parseInt(raw.hectare_squirrel_number || '0'),
    age: raw.age,
    primaryFurColor: raw.primary_fur_color,
    highlightFurColor: raw.highlight_fur_color,
    combinationOfPrimaryAndHighlightColor: raw.combination_of_primary_and_highlight_color,
    colorNotes: raw.color_notes,
    location: raw.location,
    aboveGroundSighterMeasurement: raw.above_ground_sighter_measurement,
    specificLocation: raw.specific_location,
    running: parseBoolean(raw.running),
    chasing: parseBoolean(raw.chasing),
    climbing: parseBoolean(raw.climbing),
    eating: parseBoolean(raw.eating),
    foraging: parseBoolean(raw.foraging),
    otherActivities: raw.other_activities,
    kuks: parseBoolean(raw.kuks),
    quaas: parseBoolean(raw.quaas),
    moans: parseBoolean(raw.moans),
    tailFlags: parseBoolean(raw.tail_flags),
    tailTwitches: parseBoolean(raw.tail_twitches),
    approaches: parseBoolean(raw.approaches),
    indifferent: parseBoolean(raw.indifferent),
    runsFrom: parseBoolean(raw.runs_from),
    otherInteractions: raw.other_interactions,
    latLong: raw.lat_long
  }
}

export const loadSquirrelDataFromAPI = async (): Promise<void> => {
  const API_URL = 'https://data.cityofnewyork.us/resource/vfnx-vebw.json?$limit=5000'
  
  console.log('🐿️  Fetching squirrel data from NYC Open Data...')
  
  try {
    const response = await fetch(API_URL)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`)
    }
    
    const rawData: RawSquirrelData[] = await response.json()
    console.log(`📦 Received ${rawData.length} squirrel records`)
    
    const squirrels = rawData
      .map(transformSquirrelData)
      .filter((s): s is Squirrel => s !== null)
    
    console.log(`✅ Transformed ${squirrels.length} valid squirrel records`)
    
    const inserted = await squirrelRepository.bulkInsert(squirrels)
    console.log(`💾 Saved ${inserted} squirrels to database`)
  } catch (error) {
    console.error('❌ Error loading squirrel data:', error)
    throw error
  }
}

