import { Squirrel } from '../types'
import styles from './SquirrelTooltip.module.css'

type SquirrelTooltipProps = {
  squirrel: Squirrel
}

const SquirrelTooltip = ({ squirrel }: SquirrelTooltipProps) => {
  const getColorHex = (colorName?: string): string => {
    const colorMap: Record<string, string> = {
      'Gray': '#8B8680',
      'Cinnamon': '#CD853F',
      'Black': '#2C2C2C',
      'White': '#F5F5F5',
      'Brown': '#8B4513',
    }
    return colorMap[colorName || ''] || '#8B8680'
  }

  const getActivity = () => {
    if (squirrel.eating) return '🍽️'
    if (squirrel.climbing) return '🧗'
    if (squirrel.running) return '🏃'
    if (squirrel.foraging) return '🔍'
    if (squirrel.chasing) return '💨'
    return null
  }

  const getInteraction = () => {
    if (squirrel.approaches) return '🤝'
    if (squirrel.runsFrom) return '👋'
    if (squirrel.indifferent) return '😐'
    return null
  }

  return (
    <div className={styles.tooltip}>
      <div className={styles.colors}>
        {squirrel.primaryFurColor && (
          <span 
            className={styles.colorDot} 
            style={{ 
              background: getColorHex(squirrel.primaryFurColor),
              border: squirrel.primaryFurColor === 'White' ? '1px solid #ddd' : 'none'
            }}
          />
        )}
        {squirrel.highlightFurColor && (
          <span 
            className={styles.colorDot} 
            style={{ 
              background: getColorHex(squirrel.highlightFurColor),
              border: squirrel.highlightFurColor === 'White' ? '1px solid #ddd' : 'none'
            }}
          />
        )}
      </div>

      <div className={styles.info}>
        {squirrel.age && (
          <span className={styles.badge}>
            {squirrel.age === 'Juvenile' ? '👶' : '⭐'}
          </span>
        )}
        {getActivity() && (
          <span className={styles.badge}>{getActivity()}</span>
        )}
        {getInteraction() && (
          <span className={styles.badge}>{getInteraction()}</span>
        )}
      </div>
    </div>
  )
}

export default SquirrelTooltip
