import React from 'react';
import { Floor } from '@/types/room-editor';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FloorSelectorProps {
  floors: Floor[];
  selectedFloor: number;
  selectedRoom: number;
  onSelectFloor: (floorId: number) => void;
  onSelectRoom: (roomId: number) => void;
}

export default function FloorSelector({
  floors,
  selectedFloor,
  selectedRoom,
  onSelectFloor,
  onSelectRoom,
}: FloorSelectorProps) {
  return (
    <ScrollArea className="h-[200px] w-full border-b">
      <div className="p-4">
        <h3 className="mb-2 font-semibold">Floors and Rooms</h3>
        {floors.map((floor) => (
          <div key={floor.id} className="mb-2">
            <Button
              variant={selectedFloor === floor.id ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => onSelectFloor(floor.id)}
            >
              {floor.name}
            </Button>
            {selectedFloor === floor.id && (
              <div className="ml-4 mt-1 space-y-1">
                {floor.rooms.map((room) => (
                  <Button
                    key={room.id}
                    variant={selectedRoom  === room.id ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => onSelectRoom(room.id)}
                  >
                    {room.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}