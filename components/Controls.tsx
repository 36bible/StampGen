import React from 'react';
import { StampConfig, PRESETS } from '../types';
import { RotateCcw, Calendar, Palette, Type, Sliders, Download, RefreshCw } from 'lucide-react';

interface ControlsProps {
  config: StampConfig;
  setConfig: React.Dispatch<React.SetStateAction<StampConfig>>;
  onDownload: () => void;
  isDownloading: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ config, setConfig, onDownload, isDownloading }) => {
  
  const handleChange = (key: keyof StampConfig, value: string | number | boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setConfig(prev => ({
      ...prev,
      mainText: preset.text,
      color: preset.color
    }));
  };

  const setToToday = () => {
    const today = new Date().toISOString().split('T')[0];
    handleChange('date', today);
  };

  return (
    <div className="space-y-8 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 h-full overflow-y-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-600" />
          Configuration
        </h2>
        <p className="text-sm text-slate-500 mt-1">Customize your stamp appearance</p>
      </div>

      {/* Presets */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Presets</label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="px-3 py-1.5 text-xs font-medium rounded-full border transition-all hover:scale-105 active:scale-95"
              style={{ 
                borderColor: preset.color, 
                color: config.mainText === preset.text ? 'white' : preset.color,
                backgroundColor: config.mainText === preset.text ? preset.color : 'transparent'
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Text Controls */}
      <div className="space-y-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Type className="w-3 h-3" /> Content
        </label>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Main Text</label>
          <input
            type="text"
            value={config.mainText}
            onChange={(e) => handleChange('mainText', e.target.value.toUpperCase())}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-bold tracking-widest uppercase"
            placeholder="APPROVED"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={config.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
            <button 
              onClick={setToToday}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Set to Today"
            >
              <Calendar className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Visual Controls */}
      <div className="space-y-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Palette className="w-3 h-3" /> Visuals
        </label>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0 p-0 overflow-hidden"
              />
              <span className="text-xs font-mono text-slate-500 uppercase">{config.color}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rotation</label>
            <div className="flex items-center gap-2">
               <input 
                type="range" 
                min="-45" 
                max="45" 
                value={config.rotation} 
                onChange={(e) => handleChange('rotation', parseInt(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <span className="text-xs font-mono w-8 text-right">{config.rotation}°</span>
            </div>
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
              <span>Roughness (Grunge)</span>
              <span className="text-xs text-slate-400">{Math.round(config.roughness * 100)}%</span>
           </label>
           <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1"
              value={config.roughness} 
              onChange={(e) => handleChange('roughness', parseFloat(e.target.value))}
              className="w-full accent-indigo-600"
            />
        </div>

        <div className="flex gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={config.showDots} 
                onChange={(e) => handleChange('showDots', e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500" 
              />
              <span className="text-sm text-slate-700">Dot Pattern</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={config.showBorder} 
                onChange={(e) => handleChange('showBorder', e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500" 
              />
              <span className="text-sm text-slate-700">Borders</span>
            </label>
        </div>
      </div>

      <div className="pt-6">
        <button
          onClick={onDownload}
          disabled={isDownloading}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-xl font-semibold shadow-lg shadow-slate-200 transition-all hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          {isDownloading ? 'Processing...' : 'Download PNG'}
        </button>
        <p className="text-center text-xs text-slate-400 mt-2">
          Downloads as transparent PNG
        </p>
      </div>
    </div>
  );
};