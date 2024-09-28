import React from 'react'
import { Search } from 'lucide-react'

interface ColorCardProps {
    hexColor: string;
    stackColor?: string;
  }

  export default function ColorCard({ hexColor, stackColor = '#e2e8f0' }: ColorCardProps) {
    const getContrastColor = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      return (yiq >= 128) ? 'black' : 'white';
    }
  
    const textColor = getContrastColor(hexColor);
  
    return (
      <div className="relative w-72 h-96">
        {/* Bottom card (stack effect) */}
        <div 
          className="absolute top-0 left-0 bottom-0 right-2 rounded-lg shadow-md"
          style={{ backgroundColor: stackColor }}
        ></div>
        
        {/* Main card */}
        <div 
          className="absolute inset-0 right-4 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:-translate-x-2"
          style={{ backgroundColor: hexColor }}
        >
          <div className="p-4 flex justify-between items-center">
            <span className="font-mono text-sm" style={{ color: textColor }}>HEX {hexColor}</span>
            <Search className="w-5 h-5" style={{ color: textColor }} />
          </div>
          <div className="flex-grow"></div>
          <div className="p-4">
            <span className="text-6xl font-sans" style={{ color: textColor }}>Aa</span>
          </div>
        </div>
      </div>
    )
}