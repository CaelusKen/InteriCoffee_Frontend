'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggler } from '../../buttons/theme-toggler'

type StyleOption = 'modern' | 'traditional' | 'eclectic';

interface SetupFirstProps {
  onSubmit: (data: {
    roomSize: {
      width: string
      length: string
      height: string
      measurement: string
    }
    colorPalettes: string[]
    mainStyles: StyleOption[]
    subStyles: string[]
  }) => void
  initialData?: {
    roomSize?: {
      width: string
      length: string
      height: string
      measurement: string
    }
    colorPalettes?: string[]
    mainStyles?: StyleOption[]
    subStyles?: string[]
  }
}

export default function SetupFirst({ onSubmit, initialData }: SetupFirstProps) {
  const [roomWidth, setRoomWidth] = useState(initialData?.roomSize?.width || '')
  const [roomLength, setRoomLength] = useState(initialData?.roomSize?.length || '')
  const [roomHeight, setRoomHeight] = useState(initialData?.roomSize?.height || '')
  const [measurement, setMeasurement] = useState(initialData?.roomSize?.measurement || 'feet')
  const [colorPalettes, setColorPalettes] = useState<string[]>(initialData?.colorPalettes || [])
  const [mainStyles, setMainStyles] = useState<StyleOption[]>(initialData?.mainStyles || [])
  const [subStyles, setSubStyles] = useState<string[]>(initialData?.subStyles || [])

  const colorPaletteOptions = ['Warm', 'Cool', 'Neutral', 'Vibrant']
  const mainStyleOptions: StyleOption[] = ['modern', 'traditional', 'eclectic']
  const styleOptions: Record<StyleOption, string[]> = {
    modern: ["Contemporary", "Mid-Century", "Scandinavian", "Minimalist"],
    traditional: ["Victorian", "Colonial", "Mediterranean", "Rustic"],
    eclectic: ["Bohemian", "Vintage", "Global", "Art Deco"],
  }

  const handleColorPaletteChange = (value: string) => {
    setColorPalettes((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    )
  }

  const handleMainStyleChange = (value: StyleOption) => {
    setMainStyles((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    )
    setSubStyles([])
  }

  const handleSubStyleChange = (value: string) => {
    setSubStyles((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      roomSize: {
        width: roomWidth,
        length: roomLength,
        height: roomHeight,
        measurement
      },
      colorPalettes,
      mainStyles,
      subStyles
    })
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="lg:flex-1 bg-gray-100 dark:bg-gray-800 flex flex-col justify-between p-6 lg:p-12">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-8">Welcome back!</h1>
          <div className="flex items-center">
            <span className="text-4xl lg:text-8xl font-bold mr-4 text-gray-900 dark:text-white">InteriCoffee</span>
            <Image src="/placeholder.svg" alt="Logo" width={64} height={64} className="lg:w-24 lg:h-24" />
          </div>
        </div>
        <ThemeToggler/>
      </div>
      
      <div className="lg:flex-1 flex flex-col justify-center px-6 py-8 lg:px-8 lg:py-12 bg-white dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8 w-full max-w-md mx-auto">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6">Setup Your Space</h2>
          <div className="space-y-4">
            <Label>Room Size</Label>
            <div className="grid grid-cols-3 gap-2 lg:gap-4">
              <Input
                type="number"
                placeholder="Width"
                value={roomWidth}
                onChange={(e) => setRoomWidth(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Length"
                value={roomLength}
                onChange={(e) => setRoomLength(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Height"
                value={roomHeight}
                onChange={(e) => setRoomHeight(e.target.value)}
              />
            </div>
            <Select value={measurement} onValueChange={setMeasurement}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feet">Feet</SelectItem>
                <SelectItem value="meters">Meters</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>Color Palette Preference</Label>
            <div className="flex flex-wrap gap-2">
              {colorPaletteOptions.map((palette) => (
                <Badge
                  key={palette}
                  variant={colorPalettes.includes(palette) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleColorPaletteChange(palette)}
                >
                  {palette}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Interior Design Style</Label>
            <div className="flex flex-wrap gap-2">
              {mainStyleOptions.map((style) => (
                <Badge
                  key={style}
                  variant={mainStyles.includes(style) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleMainStyleChange(style)}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </Badge>
              ))}
            </div>
            
            {mainStyles.length > 0 && (
              <div className="mt-4 space-y-4">
                {mainStyles.map((style) => (
                  <div key={style}>
                    <Label className="text-sm">{style.charAt(0).toUpperCase() + style.slice(1)} Sub-styles</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {styleOptions[style].map((subStyle) => (
                        <Badge
                          key={subStyle}
                          variant={subStyles.includes(subStyle) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleSubStyleChange(subStyle)}
                        >
                          {subStyle}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">Save Preferences</Button>
        </form>
      </div>
    </div>
  )
}