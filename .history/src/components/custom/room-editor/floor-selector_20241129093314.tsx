import React, { useState } from 'react';
import { Floor } from '@/types/room-editor';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Edit2 } from 'lucide-react';

interface FloorSelectorProps {
  floors: Floor[];
  selectedFloor: string;
  selectedRoom: string;
  onSelectFloor: (floorId: string) => void;
  onSelectRoom: (roomId: string) => void;
  onRenameFloor: (floorId: string, newName: string) => void;
  onRenameRoom: (floorId: string, roomId: string, newName: string) => void;
  onFloorChange: (floorId: string) => void;
}

export default function FloorSelector({
  floors,
  selectedFloor,
  selectedRoom,
  onSelectFloor,
  onSelectRoom,
  onRenameFloor,
  onRenameRoom,
  onFloorChange,
}: FloorSelectorProps) {
  const [editingFloorId, setEditingFloorId] = useState<string | null>(null);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const handleStartEdit = (id: string, type: 'floor' | 'room', currentName: string) => {
    if (type === 'floor') {
      setEditingFloorId(id);
    } else {
      setEditingRoomId(id);
    }
    setNewName(currentName);
  };

  const handleFinishEdit = (floorId: string, roomId: string | null) => {
    if (roomId) {
      onRenameRoom(floorId, roomId, newName);
      setEditingRoomId(null);
    } else {
      onRenameFloor(floorId, newName);
      setEditingFloorId(null);
    }
    setNewName('');
  };

  return (
    <ScrollArea className="h-[200px] w-full border-b">
      <div className="p-4">
        <h3 className="mb-2 font-semibold">Floors and Rooms</h3>
        {floors.map((floor) => (
          <div key={floor.id} className="mb-2">
            {editingFloorId === floor.id ? (
              <div className="flex items-center">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={() => handleFinishEdit(floor.id as string, null)}
                  onKeyPress={(e) => e.key === 'Enter' && handleFinishEdit(floor.id as string, null)}
                  className="mr-2"
                />
                <Button size="sm" onClick={() => handleFinishEdit(floor.id as string, null)}>
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex items-center">
                <Button
                  variant={selectedFloor === floor.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => onSelectFloor(floor.id as string)}
                >
                  {floor.name}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleStartEdit(floor.id as string, 'floor', floor.name)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
            )}
            {selectedFloor === floor.id && (
              <div className="ml-4 mt-1 space-y-1">
                {floor.rooms?.map((room) => (
                  <div key={room.id} className="flex items-center">
                    {editingRoomId === room.id ? (
                      <div className="flex items-center">
                        <Input
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          onBlur={() => handleFinishEdit(floor.id as string, room.id as string)}
                          onKeyPress={(e) => e.key === 'Enter' && handleFinishEdit(floor.id as string, room.id as string)}
                          className="mr-2"
                        />
                        <Button size="sm" onClick={() => handleFinishEdit(floor.id as string, room.id as string)}>
                          Save
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button
                          variant={selectedRoom === room.id ? "default" : "outline"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => onSelectRoom(room.id ?? '')}
                        >
                          {room.name}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStartEdit(room.id ?? '', 'room', room.name)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}