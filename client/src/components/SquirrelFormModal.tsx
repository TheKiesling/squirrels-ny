import { useState, FormEvent } from 'react'
import styles from './SquirrelModal.module.css'
import { createSquirrel } from '../services/api'
import SquirrelIllustration from './SquirrelIllustration'

type SquirrelFormModalProps = {
  latitude: number
  longitude: number
  onClose: () => void
  onSuccess: () => void
}

const SquirrelFormModal = ({ latitude, longitude, onClose, onSuccess }: SquirrelFormModalProps) => {
  const today = new Date().toISOString().split('T')[0]
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    date: today,
    shift: 'AM',
    age: '',
    primaryFurColor: '',
    highlightFurColor: '',
    location: '',
    specificLocation: '',
    aboveGroundSighterMeasurement: '',
    colorNotes: '',
    running: false,
    chasing: false,
    climbing: false,
    eating: false,
    foraging: false,
    otherActivities: '',
    kuks: false,
    quaas: false,
    moans: false,
    tailFlags: false,
    tailTwitches: false,
    approaches: false,
    indifferent: false,
    runsFrom: false,
    otherInteractions: '',
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const dateStr = formData.date.replace(/-/g, '').substring(2)
      
      const latRounded = Math.floor(latitude * 100)
      const lngRounded = Math.floor(Math.abs(longitude) * 100)
      const hectare = `${latRounded}${lngRounded}`
      
      const uniqueSquirrelId = `${hectare}-${formData.shift}-${dateStr}`
      
      const squirrelData = {
        latitude,
        longitude,
        uniqueSquirrelId,
        hectare,
        date: dateStr,
        shift: formData.shift,
        hectareSquirrelNumber: 1,
        ...(formData.age && { age: formData.age }),
        ...(formData.primaryFurColor && { primaryFurColor: formData.primaryFurColor }),
        ...(formData.highlightFurColor && { highlightFurColor: formData.highlightFurColor }),
        ...(formData.location && { location: formData.location }),
        ...(formData.specificLocation && { specificLocation: formData.specificLocation }),
        ...(formData.aboveGroundSighterMeasurement && { aboveGroundSighterMeasurement: formData.aboveGroundSighterMeasurement }),
        ...(formData.colorNotes && { colorNotes: formData.colorNotes }),
        running: formData.running,
        chasing: formData.chasing,
        climbing: formData.climbing,
        eating: formData.eating,
        foraging: formData.foraging,
        ...(formData.otherActivities && { otherActivities: formData.otherActivities }),
        kuks: formData.kuks,
        quaas: formData.quaas,
        moans: formData.moans,
        tailFlags: formData.tailFlags,
        tailTwitches: formData.tailTwitches,
        approaches: formData.approaches,
        indifferent: formData.indifferent,
        runsFrom: formData.runsFrom,
        ...(formData.otherInteractions && { otherInteractions: formData.otherInteractions }),
      }

      await createSquirrel(squirrelData)
      onSuccess()
      onClose()
    } catch (err) {
      setError('Error al crear la ardilla. Por favor intenta nuevamente.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>

        <div className={styles.content}>
          <div className={styles.illustrationSection}>
            <SquirrelIllustration
              primaryColor={formData.primaryFurColor || 'Gray'}
              highlightColor={formData.highlightFurColor}
              age={formData.age}
            />
          </div>

          <div className={styles.infoSection}>
            <div className={styles.headerInfo}>
              <h2 className={styles.squirrelId}>🐿️ Nueva Ardilla</h2>
              <div className={styles.coordinates}>
                📍 {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formSection}>
                <label className={styles.formLabel}>Fecha *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={styles.formInput}
                  required
                />
              </div>

              <div className={styles.formSection}>
                <label className={styles.formLabel}>Turno *</label>
                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    className={`${styles.optionButton} ${formData.shift === 'AM' ? styles.optionButtonActive : ''}`}
                    onClick={() => setFormData({ ...formData, shift: 'AM' })}
                  >
                    🌅 Mañana
                  </button>
                  <button
                    type="button"
                    className={`${styles.optionButton} ${formData.shift === 'PM' ? styles.optionButtonActive : ''}`}
                    onClick={() => setFormData({ ...formData, shift: 'PM' })}
                  >
                    🌆 Tarde
                  </button>
                </div>
              </div>

              <div className={styles.formSection}>
                <label className={styles.formLabel}>Edad</label>
                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    className={`${styles.optionButton} ${formData.age === 'Adult' ? styles.optionButtonActive : ''}`}
                    onClick={() => setFormData({ ...formData, age: formData.age === 'Adult' ? '' : 'Adult' })}
                  >
                    Adulto
                  </button>
                  <button
                    type="button"
                    className={`${styles.optionButton} ${formData.age === 'Juvenile' ? styles.optionButtonActive : ''}`}
                    onClick={() => setFormData({ ...formData, age: formData.age === 'Juvenile' ? '' : 'Juvenile' })}
                  >
                    Juvenil
                  </button>
                  <button
                    type="button"
                    className={`${styles.optionButton} ${formData.age === '?' ? styles.optionButtonActive : ''}`}
                    onClick={() => setFormData({ ...formData, age: formData.age === '?' ? '' : '?' })}
                  >
                    ?
                  </button>
                </div>
              </div>

              <div className={styles.formSection}>
                <label className={styles.formLabel}>Color Principal del Pelaje</label>
                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    className={`${styles.optionButton} ${formData.primaryFurColor === 'Gray' ? styles.optionButtonActive : ''}`}
                    onClick={() => setFormData({ ...formData, primaryFurColor: formData.primaryFurColor === 'Gray' ? '' : 'Gray' })}
                  >
                    🩶 Gris
                  </button>
                  <button
                    type="button"
                    className={`${styles.optionButton} ${formData.primaryFurColor === 'Cinnamon' ? styles.optionButtonActive : ''}`}
                    onClick={() => setFormData({ ...formData, primaryFurColor: formData.primaryFurColor === 'Cinnamon' ? '' : 'Cinnamon' })}
                  >
                    🟤 Canela
                  </button>
                  <button
                    type="button"
                    className={`${styles.optionButton} ${formData.primaryFurColor === 'Black' ? styles.optionButtonActive : ''}`}
                    onClick={() => setFormData({ ...formData, primaryFurColor: formData.primaryFurColor === 'Black' ? '' : 'Black' })}
                  >
                    ⬛ Negro
                  </button>
                </div>
              </div>

              <div className={styles.formSection}>
                <label className={styles.formLabel}>Color de Resaltado</label>
                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    className={`${styles.optionButton} ${formData.highlightFurColor === 'Gray' ? styles.optionButtonActive : ''}`}
                    onClick={() => setFormData({ ...formData, highlightFurColor: formData.highlightFurColor === 'Gray' ? '' : 'Gray' })}
                  >
                    🩶 Gris
                  </button>
                  <button
                    type="button"
                    className={`${styles.optionButton} ${formData.highlightFurColor === 'Cinnamon' ? styles.optionButtonActive : ''}`}
                    onClick={() => setFormData({ ...formData, highlightFurColor: formData.highlightFurColor === 'Cinnamon' ? '' : 'Cinnamon' })}
                  >
                    🟤 Canela
                  </button>
                  <button
                    type="button"
                    className={`${styles.optionButton} ${formData.highlightFurColor === 'Black' ? styles.optionButtonActive : ''}`}
                    onClick={() => setFormData({ ...formData, highlightFurColor: formData.highlightFurColor === 'Black' ? '' : 'Black' })}
                  >
                    ⬛ Negro
                  </button>
                </div>
              </div>

              <div className={styles.formSection}>
                <label className={styles.formLabel}>Ubicación</label>
                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    className={`${styles.optionButton} ${formData.location === 'Ground Plane' ? styles.optionButtonActive : ''}`}
                    onClick={() => setFormData({ ...formData, location: formData.location === 'Ground Plane' ? '' : 'Ground Plane' })}
                  >
                    🌍 Suelo
                  </button>
                  <button
                    type="button"
                    className={`${styles.optionButton} ${formData.location === 'Above Ground' ? styles.optionButtonActive : ''}`}
                    onClick={() => setFormData({ ...formData, location: formData.location === 'Above Ground' ? '' : 'Above Ground' })}
                  >
                    🌳 Sobre el suelo
                  </button>
                </div>
              </div>

              {formData.location === 'Above Ground' && (
                <div className={styles.formSection}>
                  <label className={styles.formLabel}>Altura aproximada</label>
                  <input
                    type="text"
                    value={formData.aboveGroundSighterMeasurement}
                    onChange={(e) => setFormData({ ...formData, aboveGroundSighterMeasurement: e.target.value })}
                    className={styles.formInput}
                    placeholder="Ej: 10 pies"
                  />
                </div>
              )}

              <div className={styles.formSection}>
                <label className={styles.formLabel}>Ubicación específica</label>
                <input
                  type="text"
                  value={formData.specificLocation}
                  onChange={(e) => setFormData({ ...formData, specificLocation: e.target.value })}
                  className={styles.formInput}
                  placeholder="Ej: En árbol, en banca..."
                />
              </div>

              <div className={styles.formSection}>
                <label className={styles.formLabel}>Actividades</label>
                <div className={styles.checkboxGroup}>
                  {[
                    { key: 'running', label: '🏃 Corriendo', value: formData.running },
                    { key: 'chasing', label: '💨 Persiguiendo', value: formData.chasing },
                    { key: 'climbing', label: '🧗 Escalando', value: formData.climbing },
                    { key: 'eating', label: '🍽️ Comiendo', value: formData.eating },
                    { key: 'foraging', label: '🔍 Buscando comida', value: formData.foraging },
                  ].map((activity) => (
                    <label key={activity.key} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={activity.value}
                        onChange={(e) => setFormData({ ...formData, [activity.key]: e.target.checked })}
                        className={styles.checkbox}
                      />
                      {activity.label}
                    </label>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.otherActivities}
                  onChange={(e) => setFormData({ ...formData, otherActivities: e.target.value })}
                  className={styles.formInput}
                  placeholder="Otras actividades..."
                />
              </div>

              <div className={styles.formSection}>
                <label className={styles.formLabel}>Sonidos</label>
                <div className={styles.checkboxGroup}>
                  {[
                    { key: 'kuks', label: '❗ Kuks', value: formData.kuks },
                    { key: 'quaas', label: '📢 Quaas', value: formData.quaas },
                    { key: 'moans', label: '😫 Moans', value: formData.moans },
                  ].map((sound) => (
                    <label key={sound.key} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={sound.value}
                        onChange={(e) => setFormData({ ...formData, [sound.key]: e.target.checked })}
                        className={styles.checkbox}
                      />
                      {sound.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.formSection}>
                <label className={styles.formLabel}>Lenguaje Corporal</label>
                <div className={styles.checkboxGroup}>
                  {[
                    { key: 'tailFlags', label: '🚩 Cola levantada', value: formData.tailFlags },
                    { key: 'tailTwitches', label: '〰️ Cola moviéndose', value: formData.tailTwitches },
                  ].map((behavior) => (
                    <label key={behavior.key} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={behavior.value}
                        onChange={(e) => setFormData({ ...formData, [behavior.key]: e.target.checked })}
                        className={styles.checkbox}
                      />
                      {behavior.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.formSection}>
                <label className={styles.formLabel}>Interacción Humana</label>
                <div className={styles.checkboxGroup}>
                  {[
                    { key: 'approaches', label: '🤝 Se acerca', value: formData.approaches },
                    { key: 'indifferent', label: '😐 Indiferente', value: formData.indifferent },
                    { key: 'runsFrom', label: '🏃💨 Huye', value: formData.runsFrom },
                  ].map((interaction) => (
                    <label key={interaction.key} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={interaction.value}
                        onChange={(e) => setFormData({ ...formData, [interaction.key]: e.target.checked })}
                        className={styles.checkbox}
                      />
                      {interaction.label}
                    </label>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.otherInteractions}
                  onChange={(e) => setFormData({ ...formData, otherInteractions: e.target.value })}
                  className={styles.formInput}
                  placeholder="Otras interacciones..."
                />
              </div>

              <div className={styles.formSection}>
                <label className={styles.formLabel}>Notas sobre el color</label>
                <textarea
                  value={formData.colorNotes}
                  onChange={(e) => setFormData({ ...formData, colorNotes: e.target.value })}
                  className={styles.formTextarea}
                  placeholder="Observaciones adicionales sobre el pelaje..."
                  rows={3}
                />
              </div>

              {error && (
                <div className={styles.errorMessage}>
                  {error}
                </div>
              )}

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={onClose}
                  className={styles.cancelButton}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar Ardilla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SquirrelFormModal

