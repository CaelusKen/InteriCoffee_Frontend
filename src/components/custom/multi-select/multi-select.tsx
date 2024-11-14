import React, { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Style } from '@/types/frontend/entities'

type MultiSelectProps = {
  options: Style[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
}

export function MultiSelect({ options, selected, onChange, placeholder = "Select styles..." }: MultiSelectProps) {
  const [open, setOpen] = useState(false)

  // Ensure options and selected are arrays, even if undefined
  const safeOptions = Array.isArray(options) ? options : []
  const safeSelected = Array.isArray(selected) ? selected : []

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {safeSelected.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {safeSelected.map((value) => (
                <Badge key={value} variant="secondary">
                  {safeOptions.find(option => option.id === value)?.name || value}
                </Badge>
              ))}
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search styles..." />
          <CommandEmpty>No style found.</CommandEmpty>
          <CommandGroup>
            {safeOptions.map((style) => (
              <CommandItem
                key={style.id}
                onSelect={() => {
                  onChange(
                    safeSelected.includes(style.id)
                      ? safeSelected.filter((item) => item !== style.id)
                      : [...safeSelected, style.id]
                  )
                  setOpen(true)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    safeSelected.includes(style.id) ? "opacity-100" : "opacity-0"
                  )}
                />
                {style.name}
                <span className="ml-2 text-sm text-muted-foreground">{style.description}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}