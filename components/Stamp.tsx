import React, { useMemo } from 'react';
import { StampConfig } from '../types';

interface StampProps {
  config: StampConfig;
  id?: string;
}

export const Stamp: React.FC<StampProps> = ({ config, id = "stamp-canvas" }) => {
  // Generate a unique ID for the SVG filter to avoid conflicts if multiple stamps existed
  const filterId = `noise-${id}`;

  const styles = useMemo(() => {
    return {
      container: {
        width: `${config.width}px`,
        height: `${config.height}px`,
        transform: `rotate(${config.rotation}deg)`,
        color: config.color,
      },
      outerBorder: {
        borderColor: config.color,
        borderWidth: '6px', // Thick outer border
        borderRadius: '16px',
        opacity: Math.max(0.7, 1 - config.roughness * 0.5), // Fade slightly with roughness
      },
      innerBorder: {
        borderColor: config.color,
        borderWidth: '2px', // Thin inner border
        borderRadius: '10px',
        opacity: Math.max(0.7, 1 - config.roughness * 0.5),
      },
      dots: {
        backgroundImage: `radial-gradient(${config.color} 1.5px, transparent 1.5px)`,
        backgroundSize: '8px 8px',
        opacity: 0.15, // Subtle dots
      },
      text: {
        color: config.color,
      }
    };
  }, [config]);

  return (
    <div 
      className="relative flex items-center justify-center select-none"
      style={styles.container}
    >
      {/* SVG Filter for Grunge Texture */}
      <svg className="absolute w-0 h-0">
        <filter id={filterId}>
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency={config.roughness > 0 ? "0.8" : "0"} 
            numOctaves="3" 
            result="noise" 
          />
          <feColorMatrix type="saturate" values="0" in="noise" result="desaturatedNoise" />
          <feComponentTransfer in="desaturatedNoise" result="theNoise">
              <feFuncA type="linear" slope={config.roughness * 0.8} intercept={1 - (config.roughness * 0.4)} />
          </feComponentTransfer>
          <feComposite in="SourceGraphic" in2="theNoise" operator="in" />
        </filter>
      </svg>

      {/* Main Stamp Composition Wrapper applying the filter */}
      <div 
        id={id}
        className="relative w-full h-full flex items-center justify-center p-2"
        style={{ filter: `url(#${filterId})` }}
      >
        
        {/* Outer Border */}
        {config.showBorder && (
          <div 
            className="absolute inset-0 border-solid"
            style={styles.outerBorder}
          />
        )}

        {/* Inner Border Container - increased inset to prevent overlap */}
        <div className="absolute inset-3 flex flex-col items-center justify-center overflow-hidden">
          
          {/* Inner Border Line */}
          {config.showInnerBorder && (
            <div 
              className="absolute inset-0 border-solid z-10 pointer-events-none"
              style={styles.innerBorder}
            />
          )}

          {/* Dotted Pattern Background */}
          {config.showDots && (
            <div 
              className="absolute inset-0 z-0"
              style={styles.dots}
            />
          )}

          {/* Content - increased padding to px-6 */}
          <div className="z-20 flex flex-col items-center justify-center w-full h-full px-6 py-2 text-center leading-none">
            
            {/* Main Text */}
            <div 
              className="font-extrabold tracking-widest uppercase flex items-center justify-center"
              style={{ 
                ...styles.text, 
                fontSize: `${config.height * 0.24}px`, // Slightly reduced to prevent overlap
                lineHeight: 1.1,
              }}
            >
              {config.mainText}
            </div>

            {/* Sub Text / Date */}
            {config.date && (
               <div 
               className="font-bold tracking-widest mt-2"
               style={{ 
                 ...styles.text, 
                 fontSize: `${config.height * 0.15}px`, // Increased font size for date
                 fontFamily: 'Courier Prime, monospace', // Typewriter feel
                 opacity: 0.9
               }}
             >
               {config.date}
             </div>
            )}
           
          </div>
        </div>
      </div>
    </div>
  );
};