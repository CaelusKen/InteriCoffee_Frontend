"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FilterButtonProps {
  typeOfData: string;
  dataList: FilterData[];
  selectedValues: string[];
  onSelectionChange: (type: string, values: string[]) => void;
}

type FilterData = {
  value: string;
  label: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  typeOfData,
  dataList,
  selectedValues,
  onSelectionChange,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (currentValue: string) => {
    const newSelectedValues = selectedValues.includes(currentValue)
      ? selectedValues.filter(value => value !== currentValue)
      : [...selectedValues, currentValue];
    onSelectionChange(typeOfData, newSelectedValues);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[160px] bg-white justify-between"
        >
          {selectedValues.length > 0
            ? `${typeOfData} (${selectedValues.length})`
            : typeOfData}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[160px] p-0 bg-white">
        <Command>
          <CommandInput placeholder={`Search ${typeOfData}`} />
          <CommandList>
            <CommandEmpty>No value found.</CommandEmpty>
            <CommandGroup>
              {dataList.map((data) => (
                <CommandItem
                  key={data.value}
                  value={data.value}
                  onSelect={() => handleSelect(data.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValues.includes(data.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span
                    className={cn(
                      "flex-1",
                      typeOfData === "Color" && "px-2 py-1 rounded",
                      typeOfData === "Color" && `bg-${data.value.toLowerCase()}-500`
                    )}
                  >
                    {data.label}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default FilterButton;