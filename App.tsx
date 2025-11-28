import React, { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Stamp } from './components/Stamp';
import { Controls } from './components/Controls';
import { StampConfig } from './types';
import { Stamp as StampIcon } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<StampConfig>({
    mainText: 'APPROVED',
    subText: '',
    date: '2025-11-07',
    color: '#DC2626', // Red
    width: 320,
    height: 180,
    rotation: -5,
    roughness: 0.4,
    showBorder: true,
    showInnerBorder: true,
    showDots: true,
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const stampRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (stampRef.current === null) {
      return;
    }

    setIsDownloading(true);

    try {
      // Use html-to-image to snapshot the div
      // We upscale the pixel ratio for crisp retention on high-res displays
      const dataUrl = await toPng(stampRef.current, { 
        cacheBust: true, 
        pixelRatio: 3,
        style: {
           // Ensure transformations are captured cleanly
           transform: `scale(1)`,
        }
      });
      
      const link = document.createElement('a');
      link.download = `stamp-${config.mainText.toLowerCase()}-${config.date}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }, [config]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Left Panel: Controls */}
      <aside className="w-full md:w-[400px] h-auto md:h-screen p-4 md:p-6 z-10 md:fixed md:left-0 md:top-0 md:overflow-hidden bg-slate-50">
        <div className="h-full flex flex-col">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <StampIcon size={20} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">StampGen</h1>
          </div>
          <div className="flex-1 min-h-0">
             <Controls 
              config={config} 
              setConfig={setConfig} 
              onDownload={handleDownload}
              isDownloading={isDownloading}
            />
          </div>
        </div>
      </aside>

      {/* Right Panel: Preview Area */}
      <main className="flex-1 md:ml-[400px] min-h-screen flex flex-col relative bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
        
        {/* Header/Info for Preview */}
        <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center pointer-events-none">
          <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 shadow-sm text-xs font-medium text-slate-500">
             Preview Area
          </div>
        </header>

        {/* Center Canvas */}
        <div className="flex-1 flex items-center justify-center p-8 md:p-12 overflow-hidden">
          
          <div className="relative group">
            {/* The Actual Rendered Stamp */}
            <div 
              className="relative transition-transform duration-200 ease-out"
              style={{
                 // Subtle float effect
                 filter: 'drop-shadow(0 20px 25px rgb(0 0 0 / 0.1)) drop-shadow(0 8px 10px rgb(0 0 0 / 0.1))'
              }}
            >
              {/* Invisible Wrapper for Capture (removes rotation for capture if needed, or keeps it) */}
              <div ref={stampRef} className="p-8 bg-transparent"> 
                 <Stamp config={config} />
              </div>
            </div>

            {/* Helper Text */}
            <div className="absolute -bottom-12 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 text-sm">
              Visual Preview
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="p-6 text-center text-slate-400 text-xs">
          Generated entirely with CSS & SVG. No images were harmed.
        </footer>

      </main>
    </div>
  );
};

export default App;