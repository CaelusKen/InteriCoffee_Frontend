import { Button } from "@/components/ui/button"

interface FloorSelectorProps {
  selectedFloor: number
  onSelectFloor: (floor: number) => void
}

export default function FloorSelector({ selectedFloor, onSelectFloor }: FloorSelectorProps) {
  const floors = [1, 2, 3] // Example floors

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Select Floor</h3>
      <div className="flex flex-col gap-2">
        {floors.map((floor) => (
          <Button
            key={floor}
            variant={selectedFloor === floor ? "default" : "outline"}
            onClick={() => onSelectFloor(floor)}
          >
            Floor {floor}
          </Button>
        ))}
      </div>
    </div>
  )
}