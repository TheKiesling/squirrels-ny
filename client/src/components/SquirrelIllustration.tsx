type SquirrelIllustrationProps = {
  primaryColor?: string
  highlightColor?: string
  age?: string
}

const SquirrelIllustration = ({ primaryColor, highlightColor, age }: SquirrelIllustrationProps) => {
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

  const primaryHex = getColorHex(primaryColor)
  const highlightHex = getColorHex(highlightColor)
  const accentColor = highlightColor ? highlightHex : primaryHex

  const getDarkerShade = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const darker = (val: number) => Math.max(0, Math.floor(val * 0.7))
    return `#${darker(r).toString(16).padStart(2, '0')}${darker(g).toString(16).padStart(2, '0')}${darker(b).toString(16).padStart(2, '0')}`
  }

  const getLighterShade = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const lighter = (val: number) => Math.min(255, Math.floor(val + (255 - val) * 0.4))
    return `#${lighter(r).toString(16).padStart(2, '0')}${lighter(g).toString(16).padStart(2, '0')}${lighter(b).toString(16).padStart(2, '0')}`
  }

  const darkerPrimary = getDarkerShade(primaryHex)
  const lighterPrimary = getLighterShade(primaryHex)

  const getSquirrelSize = () => {
    if (age === 'Juvenile') return { scale: 0.82, label: '🌱 Young' }
    if (age === 'Adult') return { scale: 1, label: '⭐ Adult' }
    return { scale: 0.92, label: '🐿️' }
  }

  const sizeInfo = getSquirrelSize()

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '16px',
      padding: '8px'
    }}>
      <div style={{ 
        transform: `scale(${sizeInfo.scale})`,
        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))'
      }}>
        <svg width="220" height="240" viewBox="0 0 220 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={lighterPrimary} />
              <stop offset="50%" stopColor={primaryHex} />
              <stop offset="100%" stopColor={darkerPrimary} />
            </linearGradient>
            
            <linearGradient id="tailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryHex} />
              <stop offset="40%" stopColor={accentColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor={primaryHex} />
            </linearGradient>

            <radialGradient id="bellyGradient" cx="50%" cy="50%">
              <stop offset="0%" stopColor={lighterPrimary} stopOpacity="0.9" />
              <stop offset="100%" stopColor={primaryHex} stopOpacity="0.3" />
            </radialGradient>

            <filter id="shadow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
              <feOffset dx="2" dy="6" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.25"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="innerShadow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
              <feOffset dx="1" dy="1"/>
              <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
              <feBlend in2="SourceGraphic" mode="multiply"/>
            </filter>
          </defs>

          <g filter="url(#shadow)">
            {/* Magnificent Bushy Tail */}
            <g className="tail">
              <path
                d="M 110 160 Q 80 140 60 120 Q 45 100 40 80 Q 35 60 38 40 Q 40 25 45 15 Q 48 8 52 5"
                stroke="url(#tailGradient)"
                strokeWidth="35"
                fill="none"
                strokeLinecap="round"
                opacity="0.95"
              />
              <path
                d="M 110 160 Q 80 140 60 120 Q 45 100 40 80 Q 35 60 38 40 Q 40 25 45 15"
                stroke={accentColor}
                strokeWidth="22"
                fill="none"
                strokeLinecap="round"
                opacity="0.6"
              />
              {/* Tail fur texture */}
              <path d="M 52 18 Q 48 22 45 28" stroke={lighterPrimary} strokeWidth="3" opacity="0.7" strokeLinecap="round"/>
              <path d="M 42 45 Q 38 50 36 58" stroke={lighterPrimary} strokeWidth="3" opacity="0.7" strokeLinecap="round"/>
              <path d="M 38 70 Q 35 78 34 86" stroke={lighterPrimary} strokeWidth="3" opacity="0.7" strokeLinecap="round"/>
              <path d="M 42 100 Q 40 108 40 115" stroke={lighterPrimary} strokeWidth="3" opacity="0.7" strokeLinecap="round"/>
            </g>

            {/* Back Legs */}
            <ellipse cx="95" cy="185" rx="12" ry="20" fill="url(#bodyGradient)" transform="rotate(-15 95 185)"/>
            <ellipse cx="130" cy="185" rx="12" ry="20" fill="url(#bodyGradient)" transform="rotate(15 130 185)"/>
            
            {/* Feet */}
            <ellipse cx="95" cy="202" rx="14" ry="8" fill={darkerPrimary}/>
            <ellipse cx="130" cy="202" rx="14" ry="8" fill={darkerPrimary}/>
            
            {/* Toes */}
            <circle cx="88" cy="205" r="2.5" fill={darkerPrimary}/>
            <circle cx="95" cy="207" r="2.5" fill={darkerPrimary}/>
            <circle cx="102" cy="205" r="2.5" fill={darkerPrimary}/>
            <circle cx="123" cy="205" r="2.5" fill={darkerPrimary}/>
            <circle cx="130" cy="207" r="2.5" fill={darkerPrimary}/>
            <circle cx="137" cy="205" r="2.5" fill={darkerPrimary}/>

            {/* Body */}
            <ellipse cx="110" cy="160" rx="38" ry="50" fill="url(#bodyGradient)"/>
            
            {/* Belly highlight */}
            <ellipse cx="115" cy="165" rx="28" ry="38" fill="url(#bellyGradient)"/>

            {/* Head */}
            <ellipse cx="110" cy="100" rx="42" ry="48" fill="url(#bodyGradient)"/>
            
            {/* Head highlight */}
            <ellipse cx="113" cy="105" rx="32" ry="36" fill={lighterPrimary} opacity="0.3"/>

            {/* Ears */}
            <g className="ears">
              <ellipse cx="85" cy="72" rx="14" ry="20" fill={primaryHex} transform="rotate(-25 85 72)"/>
              <ellipse cx="85" cy="72" rx="8" ry="12" fill={accentColor} opacity="0.7" transform="rotate(-25 85 72)"/>
              
              <ellipse cx="135" cy="72" rx="14" ry="20" fill={primaryHex} transform="rotate(25 135 72)"/>
              <ellipse cx="135" cy="72" rx="8" ry="12" fill={accentColor} opacity="0.7" transform="rotate(25 135 72)"/>
              
              {/* Ear tufts */}
              {age === 'Adult' && (
                <>
                  <path d="M 82 62 Q 80 56 82 52" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M 86 60 Q 85 54 87 50" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M 138 62 Q 140 56 138 52" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M 134 60 Q 135 54 133 50" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round"/>
                </>
              )}
            </g>

            {/* Cheeks */}
            <ellipse cx="82" cy="108" rx="12" ry="14" fill={accentColor} opacity="0.6"/>
            <ellipse cx="138" cy="108" rx="12" ry="14" fill={accentColor} opacity="0.6"/>
            
            {/* Cheek highlights */}
            <ellipse cx="80" cy="106" rx="6" ry="7" fill={lighterPrimary} opacity="0.5"/>
            <ellipse cx="136" cy="106" rx="6" ry="7" fill={lighterPrimary} opacity="0.5"/>

            {/* Eyes */}
            <g className="eyes">
              <ellipse cx="95" cy="98" rx="8" ry="10" fill="white"/>
              <ellipse cx="125" cy="98" rx="8" ry="10" fill="white"/>
              
              <circle cx="96" cy="99" r="6" fill="#2C2C2C"/>
              <circle cx="124" cy="99" r="6" fill="#2C2C2C"/>
              
              <circle cx="97" cy="97" r="2.5" fill="white" opacity="0.9"/>
              <circle cx="125" cy="97" r="2.5" fill="white" opacity="0.9"/>
            </g>

            {/* Nose */}
            <ellipse cx="110" cy="112" rx="5" ry="6" fill="#2C2C2C"/>
            <ellipse cx="110" cy="111" rx="2" ry="2.5" fill="white" opacity="0.4"/>

            {/* Mouth */}
            <path 
              d="M 110 114 Q 104 118 100 116" 
              stroke="#2C2C2C" 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round"
            />
            <path 
              d="M 110 114 Q 116 118 120 116" 
              stroke="#2C2C2C" 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round"
            />

            {/* Whiskers */}
            <g className="whiskers" opacity="0.7">
              <line x1="70" y1="105" x2="45" y2="100" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="70" y1="110" x2="42" y2="110" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="72" y1="115" x2="47" y2="118" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round"/>
              
              <line x1="150" y1="105" x2="175" y2="100" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="150" y1="110" x2="178" y2="110" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="148" y1="115" x2="173" y2="118" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round"/>
            </g>

            {/* Front Arms */}
            <g className="arms">
              <ellipse cx="90" cy="145" rx="10" ry="22" fill="url(#bodyGradient)" transform="rotate(-20 90 145)"/>
              <ellipse cx="130" cy="145" rx="10" ry="22" fill="url(#bodyGradient)" transform="rotate(20 130 145)"/>
              
              {/* Paws */}
              <ellipse cx="85" cy="165" rx="8" ry="6" fill={darkerPrimary} transform="rotate(-10 85 165)"/>
              <ellipse cx="135" cy="165" rx="8" ry="6" fill={darkerPrimary} transform="rotate(10 135 165)"/>
              
              {/* Little fingers */}
              <circle cx="82" cy="168" r="1.8" fill={darkerPrimary}/>
              <circle cx="85" cy="169" r="1.8" fill={darkerPrimary}/>
              <circle cx="88" cy="168" r="1.8" fill={darkerPrimary}/>
              <circle cx="132" cy="168" r="1.8" fill={darkerPrimary}/>
              <circle cx="135" cy="169" r="1.8" fill={darkerPrimary}/>
              <circle cx="138" cy="168" r="1.8" fill={darkerPrimary}/>
            </g>

            {/* Acorn (cute detail) */}
            <g transform="translate(112, 170)">
              <ellipse cx="0" cy="0" rx="6" ry="7" fill="#8B4513"/>
              <path d="M -6 -3 Q 0 -8 6 -3" fill="#654321"/>
              <ellipse cx="0" cy="-5" rx="5" ry="3" fill="#654321"/>
            </g>
          </g>

          <style>
            {`
              .tail {
                animation: tailWag 3s ease-in-out infinite;
                transform-origin: 110px 160px;
              }
              @keyframes tailWag {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(-3deg); }
              }
              
              .ears {
                animation: earTwitch 4s ease-in-out infinite;
              }
              @keyframes earTwitch {
                0%, 90%, 100% { transform: translateY(0); }
                95% { transform: translateY(-2px); }
              }
              
              .eyes {
                animation: blink 5s ease-in-out infinite;
              }
              @keyframes blink {
                0%, 48%, 52%, 100% { opacity: 1; }
                50% { opacity: 0.1; }
              }
              
              .whiskers {
                animation: whiskerMove 2.5s ease-in-out infinite;
              }
              @keyframes whiskerMove {
                0%, 100% { transform: translateX(0); }
                50% { transform: translateX(1px); }
              }

              .arms {
                animation: breathe 3s ease-in-out infinite;
                transform-origin: 110px 145px;
              }
              @keyframes breathe {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
              }
            `}
          </style>
        </svg>
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        flexWrap: 'wrap', 
        justifyContent: 'center',
        marginTop: '4px'
      }}>
        {primaryColor && (
          <span style={{
            padding: '8px 16px',
            borderRadius: '20px',
            background: primaryHex,
            color: primaryColor === 'White' ? '#2C2C2C' : '#FFF',
            fontSize: '13px',
            fontWeight: '700',
            boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
            border: primaryColor === 'White' ? '2px solid #e0e0e0' : 'none',
            letterSpacing: '0.3px'
          }}>
            {primaryColor}
          </span>
        )}
        {highlightColor && (
          <span style={{
            padding: '8px 16px',
            borderRadius: '20px',
            background: highlightHex,
            color: highlightColor === 'White' ? '#2C2C2C' : '#FFF',
            fontSize: '13px',
            fontWeight: '700',
            boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
            border: highlightColor === 'White' ? '2px solid #e0e0e0' : 'none',
            letterSpacing: '0.3px'
          }}>
            ✨ {highlightColor}
          </span>
        )}
      </div>
      
      {age && (
        <div style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#555',
          marginTop: '2px',
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '6px 16px',
          borderRadius: '12px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {sizeInfo.label}
        </div>
      )}
    </div>
  )
}

export default SquirrelIllustration
