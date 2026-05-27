import React from 'react';

/**
 * WordPal Mascot component "Teddy Pal" (Maltipoo / Teddy Dog Japanese Indie Style)
 * @param {string} mood - The current mood of Teddy Pal ('happy' | 'thinking' | 'wave' | 'empty' | 'celebrate')
 * @param {string} className - Additional CSS classes
 * @param {number} size - Size in pixels (defaults to 120)
 */
export default function Mascot({ mood = 'happy', className = '', size = 120 }) {
  // Color configuration
  const furColor = '#F6E4D9';         // Warm apricot/beige puppy fur
  const snoutColor = '#FFFFFF';       // Creamy white snout
  const outlineColor = '#4E3629';     // Warm roasted tea brown outline
  const blushColor = '#FFB6B6';       // Soft pink cheeks
  const eyeColor = '#32221A';         // Dark warm brown eyes
  const tongueColor = '#E58F8F';      // Pastel pink tongue

  // Decide rotation of the head for thinking mood (tilted head is super cute!)
  const headTransform = mood === 'thinking' ? 'rotate(-6 100 110)' : 'none';

  return (
    <div 
      className={`relative inline-flex items-center justify-center spring-transition ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 200 200" 
        className="w-full h-full drop-shadow-[0_6px_12px_rgba(78,54,41,0.06)]"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tail (Wags when happy/celebrate) */}
        <g 
          className={`origin-[130px_160px] ${mood === 'happy' || mood === 'celebrate' ? 'animate-wave' : ''}`}
          style={{ transform: mood === 'thinking' ? 'rotate(10deg)' : 'none' }}
        >
          <path 
            d="M130 160C150 165 168 150 172 135C175 125 165 125 155 138C145 150 135 155 130 160Z" 
            fill={furColor} 
            stroke={outlineColor} 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </g>

        {/* Dog Body (Cute round sitting position) */}
        <path 
          d="M60 140C60 172 140 172 140 140C140 130 120 125 100 125C80 125 60 130 60 140Z" 
          fill={furColor} 
          stroke={outlineColor} 
          strokeWidth="5.5" 
          strokeLinejoin="round"
        />

        {/* Back Feet */}
        <ellipse cx="55" cy="172" rx="14" ry="9" fill={furColor} stroke={outlineColor} strokeWidth="4.5" />
        <ellipse cx="145" cy="172" rx="14" ry="9" fill={furColor} stroke={outlineColor} strokeWidth="4.5" />

        {/* Head Group (tilts when thinking) */}
        <g style={{ transform: headTransform, transformOrigin: '100px 110px' }} className="transition-transform duration-500">
          
          {/* Left Fluffy Floppy Ear */}
          <g className="origin-[60px_75px] transition-transform duration-500" style={{ transform: mood === 'celebrate' ? 'rotate(-10deg)' : mood === 'empty' ? 'rotate(5deg)' : 'none' }}>
            {/* Ear main body (bumpy/wavy fluffy silhouette) */}
            <path 
              d="M60 75C40 70 20 85 18 115C16 135 30 145 42 140C52 135 58 110 60 95" 
              fill={furColor} 
              stroke={outlineColor} 
              strokeWidth="5.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            {/* Fluffy ear texture line */}
            <path d="M35 95C30 105 32 120 40 125" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Right Fluffy Floppy Ear */}
          <g className="origin-[140px_75px] transition-transform duration-500" style={{ transform: mood === 'celebrate' ? 'rotate(10deg)' : mood === 'empty' ? 'rotate(-5deg)' : 'none' }}>
            {/* Ear main body */}
            <path 
              d="M140 75C160 70 180 85 182 115C184 135 170 145 158 140C148 135 142 110 140 95" 
              fill={furColor} 
              stroke={outlineColor} 
              strokeWidth="5.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            {/* Fluffy ear texture line */}
            <path d="M165 95C170 105 168 120 160 125" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Head Base (fluffy round shape) */}
          <path 
            d="M100 55C135 55 152 70 152 95C152 110 145 128 135 132C120 138 110 138 100 138C90 138 80 138 65 132C55 128 48 110 48 95C48 70 65 55 100 55Z" 
            fill={furColor} 
            stroke={outlineColor} 
            strokeWidth="6" 
            strokeLinejoin="round"
          />

          {/* Fur tuft on head (cute floppy curls) */}
          <path 
            d="M85 58C80 50 90 44 95 50C100 42 110 45 108 53C115 48 122 55 115 60" 
            stroke={outlineColor} 
            strokeWidth="4" 
            strokeLinecap="round" 
            fill={furColor}
          />

          {/* Eyes (Maltese-like wide apart round black beads) */}
          {mood === 'happy' || mood === 'celebrate' ? (
            // Smiling crescent eyes
            <g>
              <path d="M 68 88 Q 75 80, 82 88" stroke={eyeColor} strokeWidth="5.5" strokeLinecap="round" />
              <path d="M 118 88 Q 125 80, 132 88" stroke={eyeColor} strokeWidth="5.5" strokeLinecap="round" />
            </g>
          ) : mood === 'empty' ? (
            // Sad puppy dog eyes
            <g>
              <circle cx="74" cy="92" r="6" fill={eyeColor} />
              <circle cx="72" cy="90" r="2.5" fill="#FFFFFF" />
              <circle cx="126" cy="92" r="6" fill={eyeColor} />
              <circle cx="124" cy="90" r="2.5" fill="#FFFFFF" />
              {/* Worried brows */}
              <path d="M68 80C72 82 78 82 80 79" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
              <path d="M120 79C122 82 128 82 132 80" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
            </g>
          ) : (
            // Standard cute round eyes with shiny highlight
            <g>
              <circle cx="74" cy="92" r="6.5" fill={eyeColor} />
              <circle cx="72" cy="89.5" r="2.8" fill="#FFFFFF" />
              <circle cx="126" cy="92" r="6.5" fill={eyeColor} />
              <circle cx="124" cy="89.5" r="2.8" fill="#FFFFFF" />
            </g>
          )}

          {/* Snout/Muzzle (White rounded fluffy patch) */}
          <ellipse cx="100" cy="103" rx="16" ry="11" fill={snoutColor} stroke={outlineColor} strokeWidth="4" />

          {/* Button Nose */}
          <ellipse cx="100" cy="98" rx="6" ry="4" fill="#1C110C" />

          {/* Puppy Mouth (Cute 'w' shape) */}
          {mood === 'celebrate' ? (
            // Tongue out
            <g>
              <path 
                d="M94 103Q97 108 100 104Q103 108 106 103" 
                stroke={outlineColor} 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />
              <path 
                d="M97 105C97 114 103 114 103 105Z" 
                fill={tongueColor} 
                stroke={outlineColor} 
                strokeWidth="3.5"
              />
            </g>
          ) : mood === 'happy' ? (
            // Small happy mouth
            <path 
              d="M94 104C94 104 96 112 100 112C104 112 106 104 106 104" 
              fill={tongueColor} 
              stroke={outlineColor} 
              strokeWidth="3.5" 
              strokeLinecap="round"
            />
          ) : mood === 'empty' ? (
            // Tiny sad mouth
            <circle cx="100" cy="108" r="3" stroke={outlineColor} strokeWidth="3.5" />
          ) : (
            // Standard 'w' puppy mouth
            <path 
              d="M94 104Q97 108 100 104Q103 108 106 104" 
              stroke={outlineColor} 
              strokeWidth="3.5" 
              strokeLinecap="round"
            />
          )}

          {/* Blush Cheeks */}
          <ellipse cx="60" cy="101" rx="7" ry="4.5" fill={blushColor} />
          <ellipse cx="140" cy="101" rx="7" ry="4.5" fill={blushColor} />

        </g>

        {/* Front Paws */}
        <g>
          {/* Left Paw */}
          <ellipse cx="80" cy="156" rx="9" ry="12" fill={furColor} stroke={outlineColor} strokeWidth="4.5" />
          <path d="M76 160L76 165" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M84 160L84 165" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />

          {/* Right Paw (Waving or sitting) */}
          {mood === 'wave' ? (
            <g className="animate-wave origin-[115px_150px]">
              <ellipse cx="125" cy="132" rx="12" ry="9" fill={furColor} stroke={outlineColor} strokeWidth="4.5" />
              <path d="M120 128L117 134" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
              <path d="M126 126L124 132" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
            </g>
          ) : (
            <g>
              <ellipse cx="120" cy="156" rx="9" ry="12" fill={furColor} stroke={outlineColor} strokeWidth="4.5" />
              <path d="M116 160L116 165" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
              <path d="M124 160L124 165" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
            </g>
          )}
        </g>

        {/* Cherry blossom petal floating (🌸) for Japanese vibe! */}
        <g className="origin-[100px_35px] animate-bounce-subtle">
          <path 
            d="M100 37 C97 32, 92 30, 96 24 C100 27, 100 27, 104 24 C108 30, 103 32, 100 37 Z" 
            fill="#FFC0CB" 
            stroke={outlineColor} 
            strokeWidth="2.2" 
          />
        </g>
      </svg>

      {/* Floating elements */}
      {mood === 'thinking' && (
        <div className="absolute -top-3 -right-2 text-2xl animate-bounce-subtle">
          🍃
        </div>
      )}

      {mood === 'celebrate' && (
        <>
          <div className="absolute -top-2 -left-2 text-xl animate-ping duration-1000">🌸</div>
          <div className="absolute -bottom-1 -right-2 text-lg animate-ping duration-700">🌸</div>
        </>
      )}
    </div>
  );
}
