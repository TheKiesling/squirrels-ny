import { useState, useMemo, useRef, useEffect } from 'react'
import styles from './FilterPanel.module.css'
import { Squirrel } from '../types'

export type FilterState = {
  shift: Set<string>
  age: Set<string>
  primaryFurColor: Set<string>
  highlightFurColor: Set<string>
  location: Set<string>
  activities: Set<string>
  sounds: Set<string>
  tailBehaviors: Set<string>
  interactions: Set<string>
}

type FilterPanelProps = {
  squirrels: Squirrel[]
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

const FILTER_CATEGORIES = {
  shift: 'Turno',
  age: 'Edad',
  primaryFurColor: 'Color Primario',
  highlightFurColor: 'Color Destacado',
  location: 'Ubicación',
  activities: 'Actividades',
  sounds: 'Sonidos',
  tailBehaviors: 'Comportamiento de Cola',
  interactions: 'Interacciones',
}

const ACTIVITY_FIELDS: (keyof Squirrel)[] = ['running', 'chasing', 'climbing', 'eating', 'foraging']
const SOUND_FIELDS: (keyof Squirrel)[] = ['kuks', 'quaas', 'moans']
const TAIL_BEHAVIOR_FIELDS: (keyof Squirrel)[] = ['tailFlags', 'tailTwitches']
const INTERACTION_FIELDS: (keyof Squirrel)[] = ['approaches', 'indifferent', 'runsFrom']

const FIELD_LABELS: Record<string, string> = {
  running: 'Corriendo',
  chasing: 'Persiguiendo',
  climbing: 'Trepando',
  eating: 'Comiendo',
  foraging: 'Buscando comida',
  kuks: 'Kuks',
  quaas: 'Quaas',
  moans: 'Gemidos',
  tailFlags: 'Bandera de cola',
  tailTwitches: 'Movimiento de cola',
  approaches: 'Se acerca',
  indifferent: 'Indiferente',
  runsFrom: 'Huye',
}

const FilterPanel = ({ squirrels, filters, onFiltersChange }: FilterPanelProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        panelRef.current &&
        buttonRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const availableValues = useMemo(() => {
    const values: Record<string, Set<string>> = {
      shift: new Set(),
      age: new Set(),
      primaryFurColor: new Set(),
      highlightFurColor: new Set(),
      location: new Set(),
      activities: new Set(),
      sounds: new Set(),
      tailBehaviors: new Set(),
      interactions: new Set(),
    }

    squirrels.forEach(squirrel => {
      if (squirrel.shift) values.shift.add(squirrel.shift)
      if (squirrel.age) values.age.add(squirrel.age)
      if (squirrel.primaryFurColor) values.primaryFurColor.add(squirrel.primaryFurColor)
      if (squirrel.highlightFurColor) values.highlightFurColor.add(squirrel.highlightFurColor)
      if (squirrel.location) values.location.add(squirrel.location)

      ACTIVITY_FIELDS.forEach(field => {
        if (squirrel[field]) values.activities.add(field)
      })

      SOUND_FIELDS.forEach(field => {
        if (squirrel[field]) values.sounds.add(field)
      })

      TAIL_BEHAVIOR_FIELDS.forEach(field => {
        if (squirrel[field]) values.tailBehaviors.add(field)
      })

      INTERACTION_FIELDS.forEach(field => {
        if (squirrel[field]) values.interactions.add(field)
      })
    })

    return values
  }, [squirrels])

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).reduce((count, set) => count + set.size, 0)
  }, [filters])

  const toggleFilter = (category: keyof FilterState, value: string) => {
    const newFilters = { ...filters }
    const categorySet = new Set(newFilters[category])
    
    if (categorySet.has(value)) {
      categorySet.delete(value)
    } else {
      categorySet.add(value)
    }
    
    newFilters[category] = categorySet
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    onFiltersChange({
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
  }

  const renderCheckboxGroup = (category: keyof FilterState, values: Set<string>) => {
    if (values.size === 0) return null

    const sortedValues = Array.from(values).sort()

    return (
      <div className={styles.categorySection} key={category}>
        <span className={styles.categoryTitle}>
          {FILTER_CATEGORIES[category]}
        </span>
        <div className={styles.checkboxGroup}>
          {sortedValues.map(value => (
            <label key={value} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={filters[category].has(value)}
                onChange={() => toggleFilter(category, value)}
              />
              <span>{FIELD_LABELS[value] || value}</span>
            </label>
          ))}
        </div>
      </div>
    )
  }

  if (!isOpen) {
    return (
      <button
        ref={buttonRef}
        className={styles.filterButton}
        onClick={() => setIsOpen(true)}
        title="Filtros"
      >
        🔍
        {activeFiltersCount > 0 && (
          <div className={styles.activeFiltersCount}>{activeFiltersCount}</div>
        )}
      </button>
    )
  }

  return (
    <div ref={panelRef} className={styles.filterPanel}>
      <div className={styles.filterHeader}>
        <h3 className={styles.filterTitle}>Filtros</h3>
        <button
          className={styles.closeButton}
          onClick={() => setIsOpen(false)}
          title="Cerrar"
        >
          ×
        </button>
      </div>

      <div className={styles.filterActions}>
        <button
          className={`${styles.actionButton} ${styles.clearButton}`}
          onClick={clearAllFilters}
        >
          Limpiar todo
        </button>
      </div>

      {renderCheckboxGroup('shift', availableValues.shift)}
      {renderCheckboxGroup('age', availableValues.age)}
      {renderCheckboxGroup('primaryFurColor', availableValues.primaryFurColor)}
      {renderCheckboxGroup('highlightFurColor', availableValues.highlightFurColor)}
      {renderCheckboxGroup('location', availableValues.location)}
      {renderCheckboxGroup('activities', availableValues.activities)}
      {renderCheckboxGroup('sounds', availableValues.sounds)}
      {renderCheckboxGroup('tailBehaviors', availableValues.tailBehaviors)}
      {renderCheckboxGroup('interactions', availableValues.interactions)}
    </div>
  )
}

export default FilterPanel

