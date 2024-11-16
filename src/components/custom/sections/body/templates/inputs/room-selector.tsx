import { Button } from "@/components/ui/button"

interface RoomSelectorProps {
  selectedRoom: string
  onSelectRoom: (room: string) => void
}

export default function RoomSelector({ selectedRoom, onSelectRoom }: RoomSelectorProps) {
  const rooms = [
    { id: 'living_room', name: 'Living Room' },
    { id: 'bedroom', name: 'Bedroom' },
    { id: 'kitchen', name: 'Kitchen' },
    { id: 'bathroom', name: 'Bathroom' },
  ]

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Select Room</h3>
      <div className="flex flex-col gap-2">
        {rooms.map((room) => (
          <Button
            key={room.id}
            variant={selectedRoom === room.id ? "default" : "outline"}
            onClick={() => onSelectRoom(room.id)}
          >
            {room.name}
          </Button>
        ))}
      </div>
    </div>
  )
}