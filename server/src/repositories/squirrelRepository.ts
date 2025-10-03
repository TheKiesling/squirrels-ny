import { pool } from '../config/database.js'
import { Squirrel } from '../types/index.js'

const mapRowToSquirrel = (row: Record<string, unknown>): Squirrel => ({
  id: row.id as string,
  latitude: Number(row.latitude),
  longitude: Number(row.longitude),
  uniqueSquirrelId: row.unique_squirrel_id as string,
  hectare: row.hectare as string,
  shift: row.shift as string,
  date: row.date as string,
  hectareSquirrelNumber: row.hectare_squirrel_number as number,
  age: row.age as string | undefined,
  primaryFurColor: row.primary_fur_color as string | undefined,
  highlightFurColor: row.highlight_fur_color as string | undefined,
  combinationOfPrimaryAndHighlightColor: row.combination_of_primary_and_highlight_color as string | undefined,
  colorNotes: row.color_notes as string | undefined,
  location: row.location as string | undefined,
  aboveGroundSighterMeasurement: row.above_ground_sighter_measurement as string | undefined,
  specificLocation: row.specific_location as string | undefined,
  running: row.running as boolean | undefined,
  chasing: row.chasing as boolean | undefined,
  climbing: row.climbing as boolean | undefined,
  eating: row.eating as boolean | undefined,
  foraging: row.foraging as boolean | undefined,
  otherActivities: row.other_activities as string | undefined,
  kuks: row.kuks as boolean | undefined,
  quaas: row.quaas as boolean | undefined,
  moans: row.moans as boolean | undefined,
  tailFlags: row.tail_flags as boolean | undefined,
  tailTwitches: row.tail_twitches as boolean | undefined,
  approaches: row.approaches as boolean | undefined,
  indifferent: row.indifferent as boolean | undefined,
  runsFrom: row.runs_from as boolean | undefined,
  otherInteractions: row.other_interactions as string | undefined,
  latLong: row.lat_long as string | undefined,
})

export const findAll = async (): Promise<Squirrel[]> => {
  const result = await pool.query('SELECT * FROM squirrels ORDER BY created_at DESC')
  return result.rows.map(mapRowToSquirrel)
}

export const findById = async (id: string): Promise<Squirrel | null> => {
  const result = await pool.query(
    'SELECT * FROM squirrels WHERE id = $1',
    [id]
  )
  
  if (result.rows.length === 0) {
    return null
  }
  
  return mapRowToSquirrel(result.rows[0])
}

export const create = async (squirrel: Squirrel): Promise<Squirrel> => {
  const result = await pool.query(
    `INSERT INTO squirrels (
      id, latitude, longitude, unique_squirrel_id, hectare, shift, date,
      hectare_squirrel_number, age, primary_fur_color, highlight_fur_color,
      combination_of_primary_and_highlight_color, color_notes, location,
      above_ground_sighter_measurement, specific_location, running, chasing,
      climbing, eating, foraging, other_activities, kuks, quaas, moans,
      tail_flags, tail_twitches, approaches, indifferent, runs_from,
      other_interactions, lat_long
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
      $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28,
      $29, $30, $31, $32
    ) RETURNING *`,
    [
      squirrel.id,
      squirrel.latitude,
      squirrel.longitude,
      squirrel.uniqueSquirrelId,
      squirrel.hectare,
      squirrel.shift,
      squirrel.date,
      squirrel.hectareSquirrelNumber,
      squirrel.age,
      squirrel.primaryFurColor,
      squirrel.highlightFurColor,
      squirrel.combinationOfPrimaryAndHighlightColor,
      squirrel.colorNotes,
      squirrel.location,
      squirrel.aboveGroundSighterMeasurement,
      squirrel.specificLocation,
      squirrel.running,
      squirrel.chasing,
      squirrel.climbing,
      squirrel.eating,
      squirrel.foraging,
      squirrel.otherActivities,
      squirrel.kuks,
      squirrel.quaas,
      squirrel.moans,
      squirrel.tailFlags,
      squirrel.tailTwitches,
      squirrel.approaches,
      squirrel.indifferent,
      squirrel.runsFrom,
      squirrel.otherInteractions,
      squirrel.latLong,
    ]
  )
  
  return mapRowToSquirrel(result.rows[0])
}

export const update = async (id: string, updates: Partial<Omit<Squirrel, 'id'>>): Promise<Squirrel | null> => {
  const fields: string[] = []
  const values: unknown[] = []
  let paramIndex = 1
  
  const fieldMapping: Record<string, string> = {
    latitude: 'latitude',
    longitude: 'longitude',
    uniqueSquirrelId: 'unique_squirrel_id',
    hectare: 'hectare',
    shift: 'shift',
    date: 'date',
    hectareSquirrelNumber: 'hectare_squirrel_number',
    age: 'age',
    primaryFurColor: 'primary_fur_color',
    highlightFurColor: 'highlight_fur_color',
    combinationOfPrimaryAndHighlightColor: 'combination_of_primary_and_highlight_color',
    colorNotes: 'color_notes',
    location: 'location',
    aboveGroundSighterMeasurement: 'above_ground_sighter_measurement',
    specificLocation: 'specific_location',
    running: 'running',
    chasing: 'chasing',
    climbing: 'climbing',
    eating: 'eating',
    foraging: 'foraging',
    otherActivities: 'other_activities',
    kuks: 'kuks',
    quaas: 'quaas',
    moans: 'moans',
    tailFlags: 'tail_flags',
    tailTwitches: 'tail_twitches',
    approaches: 'approaches',
    indifferent: 'indifferent',
    runsFrom: 'runs_from',
    otherInteractions: 'other_interactions',
    latLong: 'lat_long',
  }
  
  for (const [key, value] of Object.entries(updates)) {
    const dbField = fieldMapping[key]
    if (dbField && value !== undefined) {
      fields.push(`${dbField} = $${paramIndex}`)
      values.push(value)
      paramIndex++
    }
  }
  
  if (fields.length === 0) {
    return findById(id)
  }
  
  values.push(id)
  
  const result = await pool.query(
    `UPDATE squirrels SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  )
  
  if (result.rows.length === 0) {
    return null
  }
  
  return mapRowToSquirrel(result.rows[0])
}

export const remove = async (id: string): Promise<boolean> => {
  const result = await pool.query(
    'DELETE FROM squirrels WHERE id = $1',
    [id]
  )
  
  return (result.rowCount ?? 0) > 0
}

export const bulkInsert = async (squirrels: Squirrel[]): Promise<number> => {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    
    let inserted = 0
    
    for (const squirrel of squirrels) {
      await client.query(
        `INSERT INTO squirrels (
          id, latitude, longitude, unique_squirrel_id, hectare, shift, date,
          hectare_squirrel_number, age, primary_fur_color, highlight_fur_color,
          combination_of_primary_and_highlight_color, color_notes, location,
          above_ground_sighter_measurement, specific_location, running, chasing,
          climbing, eating, foraging, other_activities, kuks, quaas, moans,
          tail_flags, tail_twitches, approaches, indifferent, runs_from,
          other_interactions, lat_long
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28,
          $29, $30, $31, $32
        )`,
        [
          squirrel.id,
          squirrel.latitude,
          squirrel.longitude,
          squirrel.uniqueSquirrelId,
          squirrel.hectare,
          squirrel.shift,
          squirrel.date,
          squirrel.hectareSquirrelNumber,
          squirrel.age,
          squirrel.primaryFurColor,
          squirrel.highlightFurColor,
          squirrel.combinationOfPrimaryAndHighlightColor,
          squirrel.colorNotes,
          squirrel.location,
          squirrel.aboveGroundSighterMeasurement,
          squirrel.specificLocation,
          squirrel.running,
          squirrel.chasing,
          squirrel.climbing,
          squirrel.eating,
          squirrel.foraging,
          squirrel.otherActivities,
          squirrel.kuks,
          squirrel.quaas,
          squirrel.moans,
          squirrel.tailFlags,
          squirrel.tailTwitches,
          squirrel.approaches,
          squirrel.indifferent,
          squirrel.runsFrom,
          squirrel.otherInteractions,
          squirrel.latLong,
        ]
      )
      inserted++
    }
    
    await client.query('COMMIT')
    return inserted
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}


