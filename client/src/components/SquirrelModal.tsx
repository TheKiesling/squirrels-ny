import { Squirrel } from '../types'
import styles from './SquirrelModal.module.css'
import SquirrelIllustration from './SquirrelIllustration'

type SquirrelModalProps = {
  squirrel: Squirrel | null
  onClose: () => void
}

const SquirrelModal = ({ squirrel, onClose }: SquirrelModalProps) => {
  if (!squirrel) return null

  const formatDate = (dateStr: string) => {
    const year = dateStr.substring(4, 8)
    const month = dateStr.substring(0, 2)
    const day = dateStr.substring(2, 4)
    return `${month}/${day}/${year}`
  }

  const getShiftEmoji = (shift: string) => {
    if (shift === 'AM') return '🌅'
    if (shift === 'PM') return '🌆'
    return '⏰'
  }

  const getLocationInfo = () => {
    const parts = []
    if (squirrel.location) parts.push(squirrel.location)
    if (squirrel.specificLocation) parts.push(squirrel.specificLocation)
    if (squirrel.aboveGroundSighterMeasurement) parts.push(`${squirrel.aboveGroundSighterMeasurement} above ground`)
    return parts.length > 0 ? parts.join(' • ') : 'Ground level'
  }

  const activities = [
    { key: 'running', label: 'Running', icon: '🏃' },
    { key: 'chasing', label: 'Chasing', icon: '💨' },
    { key: 'climbing', label: 'Climbing', icon: '🧗' },
    { key: 'eating', label: 'Eating', icon: '🍽️' },
    { key: 'foraging', label: 'Foraging', icon: '🔍' },
  ].filter(activity => squirrel[activity.key as keyof Squirrel])

  const sounds = [
    { key: 'kuks', label: 'Kuks', icon: '❗' },
    { key: 'quaas', label: 'Quaas', icon: '📢' },
    { key: 'moans', label: 'Moans', icon: '😫' },
  ].filter(sound => squirrel[sound.key as keyof Squirrel])

  const bodyLanguage = [
    { key: 'tailFlags', label: 'Tail Flags', icon: '🚩' },
    { key: 'tailTwitches', label: 'Tail Twitches', icon: '〰️' },
  ].filter(bl => squirrel[bl.key as keyof Squirrel])

  const interactions = [
    { key: 'approaches', label: 'Approaches', icon: '🤝', color: '#10B981' },
    { key: 'indifferent', label: 'Indifferent', icon: '😐', color: '#6B7280' },
    { key: 'runsFrom', label: 'Runs Away', icon: '🏃💨', color: '#EF4444' },
  ].filter(interaction => squirrel[interaction.key as keyof Squirrel])

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>

        <div className={styles.content}>
          <div className={styles.illustrationSection}>
            <SquirrelIllustration 
              primaryColor={squirrel.primaryFurColor}
              highlightColor={squirrel.highlightFurColor}
              age={squirrel.age}
            />
          </div>

          <div className={styles.infoSection}>
            <div className={styles.headerInfo}>
              <h2 className={styles.squirrelId}>#{squirrel.uniqueSquirrelId}</h2>
              <div className={styles.metaInfo}>
                <span className={styles.badge}>
                  📅 {formatDate(squirrel.date)}
                </span>
                <span className={styles.badge}>
                  {getShiftEmoji(squirrel.shift)} {squirrel.shift}
                </span>
                <span className={styles.badge}>
                  📍 {squirrel.hectare}
                </span>
              </div>
            </div>

            <div className={styles.locationCard}>
              <div className={styles.locationIcon}>📍</div>
              <div className={styles.locationDetails}>
                <div className={styles.locationLabel}>Location</div>
                <div className={styles.locationValue}>{getLocationInfo()}</div>
                <div className={styles.coordinates}>
                  {squirrel.latitude.toFixed(6)}, {squirrel.longitude.toFixed(6)}
                </div>
              </div>
            </div>

            {activities.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Activities</h3>
                <div className={styles.chipContainer}>
                  {activities.map(activity => (
                    <div key={activity.key} className={styles.chip}>
                      <span className={styles.chipIcon}>{activity.icon}</span>
                      {activity.label}
                    </div>
                  ))}
                  {squirrel.otherActivities && (
                    <div className={styles.chip}>
                      <span className={styles.chipIcon}>➕</span>
                      {squirrel.otherActivities}
                    </div>
                  )}
                </div>
              </div>
            )}

            {(sounds.length > 0 || bodyLanguage.length > 0) && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Sounds & Body Language</h3>
                <div className={styles.chipContainer}>
                  {sounds.map(sound => (
                    <div key={sound.key} className={`${styles.chip} ${styles.chipSound}`}>
                      <span className={styles.chipIcon}>{sound.icon}</span>
                      {sound.label}
                    </div>
                  ))}
                  {bodyLanguage.map(bl => (
                    <div key={bl.key} className={`${styles.chip} ${styles.chipSound}`}>
                      <span className={styles.chipIcon}>{bl.icon}</span>
                      {bl.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {interactions.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Human Interaction</h3>
                <div className={styles.chipContainer}>
                  {interactions.map(interaction => (
                    <div 
                      key={interaction.key} 
                      className={`${styles.chip} ${styles.chipInteraction}`}
                      style={{ 
                        background: `${interaction.color}15`,
                        borderColor: interaction.color,
                        color: interaction.color
                      }}
                    >
                      <span className={styles.chipIcon}>{interaction.icon}</span>
                      {interaction.label}
                    </div>
                  ))}
                  {squirrel.otherInteractions && (
                    <div className={`${styles.chip} ${styles.chipInteraction}`}>
                      <span className={styles.chipIcon}>💬</span>
                      {squirrel.otherInteractions}
                    </div>
                  )}
                </div>
              </div>
            )}

            {squirrel.colorNotes && (
              <div className={styles.notesCard}>
                <div className={styles.notesIcon}>📝</div>
                <div>
                  <div className={styles.notesLabel}>Color Notes</div>
                  <div className={styles.notesText}>{squirrel.colorNotes}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SquirrelModal
