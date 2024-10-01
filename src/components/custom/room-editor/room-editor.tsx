// "use client"

// import React, { useState, useRef, Suspense, useCallback, useEffect } from 'react'
// import { Canvas, useThree, useFrame } from '@react-three/fiber'
// import { OrbitControls, TransformControls, PivotControls, Grid, Environment, useGLTF, Html, Stats, Sky, Box } from '@react-three/drei'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Slider } from "@/components/ui/slider"
// import { Switch } from "@/components/ui/switch"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { ChevronRight, Box as BoxIcon, Move, RotateCw, Maximize, Eye, EyeOff, Sun, Moon, Undo, Redo, Save, FolderOpen, Home } from 'lucide-react'

// // Placeholder furniture models
// const furnitureModels = {
//   sofa: '/assets/3d/duck.glb',
//   chair: '/assets/3d/duck.glb',
//   table: '/assets/3d/duck.glb',
// }

// // Custom hook for undo/redo functionality
// function useUndoRedo(initialState) {
//   const [state, setState] = useState(initialState)
//   const [undoStack, setUndoStack] = useState([])
//   const [redoStack, setRedoStack] = useState([])

//   const undo = useCallback(() => {
//     if (undoStack.length > 0) {
//       const prevState = undoStack[undoStack.length - 1]
//       setUndoStack(undoStack.slice(0, -1))
//       setRedoStack([state, ...redoStack])
//       setState(prevState)
//     }
//   }, [state, undoStack, redoStack])

//   const redo = useCallback(() => {
//     if (redoStack.length > 0) {
//       const nextState = redoStack[0]
//       setRedoStack(redoStack.slice(1))
//       setUndoStack([...undoStack, state])
//       setState(nextState)
//     }
//   }, [state, undoStack, redoStack])

//   const update = useCallback((newState) => {
//     setUndoStack([...undoStack, state])
//     setRedoStack([])
//     setState(newState)
//   }, [state, undoStack])

//   return [state, update, undo, redo]
// }

// // Room component for rendering the room
// function Room({ width, length, height }) {
//   return (
//     <Box args={[width, height, length]} position={[0, height / 2, 0]}>
//       <meshStandardMaterial color="#f0f0f0" side={1} transparent opacity={0.2} />
//     </Box>
//   )
// }

// // FurnitureItem component for rendering individual furniture pieces
// function FurnitureItem({ model, position, rotation, scale, onSelect, isSelected }) {
//   const { scene } = useGLTF(model)
//   const meshRef = useRef()

//   useFrame(() => {
//     if (meshRef.current) {
//       meshRef.current.rotation.y += 0.01
//     }
//   })

//   return (
//     <group 
//       position={position} 
//       rotation={rotation}
//       scale={scale}
//       onClick={(e) => {
//         e.stopPropagation()
//         onSelect()
//       }}
//     >
//       <primitive object={scene.clone()} ref={meshRef} />
//       {isSelected && (
//         <Html>
//           <div className="bg-background text-foreground p-2 rounded">
//             {model.split('/').pop()}
//           </div>
//         </Html>
//       )}
//     </group>
//   )
// }

// // SceneView component for rendering the 3D scene
// function SceneView({ room, furniture, selectedItem, onSelectItem, onUpdateTransform, transformMode }) {
//   return (
//     <>
//       <Room {...room} />
//       {furniture.map((item) => (
//         <group key={item.id}>
//           <FurnitureItem
//             {...item}
//             onSelect={() => onSelectItem(item.id)}
//             isSelected={selectedItem === item.id}
//           />
//           {selectedItem === item.id && (
//             <TransformControls
//               object={item}
//               mode={transformMode}
//               onObjectChange={(e) => onUpdateTransform(item.id, transformMode, e.target.object[transformMode].toArray())}
//             />
//           )}
//         </group>
//       ))}
//       <OrbitControls makeDefault />
//       <Grid infiniteGrid />
//       <Environment preset="apartment" />
//       <Sky />
//       <Stats />
//     </>
//   )
// }

// // Hierarchy component for displaying the scene hierarchy
// function Hierarchy({ furniture, selectedItem, onSelectItem, onToggleVisibility }) {
//   return (
//     <ScrollArea className="h-[400px]">
//       <div className="p-2">
//         <div className="font-bold mb-2">Hierarchy</div>
//         {furniture.map((item) => (
//           <div
//             key={item.id}
//             className={`flex items-center p-1 cursor-pointer ${selectedItem === item.id ? 'bg-accent' : ''}`}
//             onClick={() => onSelectItem(item.id)}
//           >
//             <ChevronRight className="w-4 h-4 mr-1" />
//             <BoxIcon className="w-4 h-4 mr-2" />
//             <span>{item.name}</span>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="ml-auto"
//               onClick={(e) => {
//                 e.stopPropagation()
//                 onToggleVisibility(item.id)
//               }}
//             >
//               {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
//             </Button>
//           </div>
//         ))}
//       </div>
//     </ScrollArea>
//   )
// }

// // Inspector component for editing properties of selected items
// function Inspector({ selectedItem, furniture, onUpdateTransform }) {
//   const item = furniture.find(i => i.id === selectedItem)

//   if (!item) return <div className="p-4">No item selected</div>

//   return (
//     <ScrollArea className="h-[400px]">
//       <div className="p-4">
//         <h3 className="font-bold mb-4">{item.name}</h3>
//         <div className="space-y-4">
//           {['position', 'rotation', 'scale'].map((prop) => (
//             <div key={prop}>
//               <Label>{prop.charAt(0).toUpperCase() + prop.slice(1)}</Label>
//               <div className="grid grid-cols-3 gap-2">
//                 {['x', 'y', 'z'].map((axis, index) => (
//                   <Input
//                     key={axis}
//                     type="number"
//                     value={item[prop][index]}
//                     onChange={(e) => {
//                       const newValue = [...item[prop]]
//                       newValue[index] = parseFloat(e.target.value)
//                       onUpdateTransform(item.id, prop, newValue)
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </ScrollArea>
//   )
// }

// // Toolbar component for various editor controls
// function Toolbar({ onAddFurniture, transformMode, setTransformMode, onUndo, onRedo, onSave, onLoad, isDarkMode, toggleDarkMode, onOpenRoomDialog }) {
//   return (
//     <div className="flex justify-between items-center p-2 bg-background border-b">
//       <div className="space-x-2">
//         <Button onClick={() => onAddFurniture('sofa')}>Add Sofa</Button>
//         <Button onClick={() => onAddFurniture('chair')}>Add Chair</Button>
//         <Button onClick={() => onAddFurniture('table')}>Add Table</Button>
//       </div>
//       <div className="space-x-2">
//         <Button variant={transformMode === 'translate' ? 'default' : 'outline'} size="icon" onClick={() => setTransformMode('translate')}>
//           <Move className="w-4 h-4" />
//         </Button>
//         <Button variant={transformMode === 'rotate' ? 'default' : 'outline'} size="icon" onClick={() => setTransformMode('rotate')}>
//           <RotateCw className="w-4 h-4" />
//         </Button>
//         <Button variant={transformMode === 'scale' ? 'default' : 'outline'} size="icon" onClick={() => setTransformMode('scale')}>
//           <Maximize className="w-4 h-4" />
//         </Button>
//       </div>
//       <div className="space-x-2">
//         <Button onClick={onUndo} size="icon"><Undo className="w-4 h-4" /></Button>
//         <Button onClick={onRedo} size="icon"><Redo className="w-4 h-4" /></Button>
//         <Button onClick={onSave} size="icon"><Save className="w-4 h-4" /></Button>
//         <Button onClick={onLoad} size="icon"><FolderOpen className="w-4 h-4" /></Button>
//         <Button onClick={onOpenRoomDialog} size="icon"><Home className="w-4 h-4" /></Button>
//         <Button onClick={toggleDarkMode} size="icon">
//           {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
//         </Button>
//       </div>
//     </div>
//   )
// }

// // RoomDialog component for inputting room dimensions
// function RoomDialog({ open, onOpenChange, onSave }) {
//   const [width, setWidth] = useState(5)
//   const [length, setLength] = useState(5)
//   const [height, setHeight] = useState(3)

//   const handleSave = () => {
//     onSave({ width, length, height })
//     onOpenChange(false)
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Room Dimensions</DialogTitle>
//           <DialogDescription>Enter the dimensions of your room in meters.</DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="width" className="text-right">Width</Label>
//             <Input
//               id="width"
//               type="number"
//               value={width}
//               onChange={(e) => setWidth(parseFloat(e.target.value))}
//               className="col-span-3"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="length" className="text-right">Length</Label>
//             <Input
//               id="length"
//               type="number"
//               value={length}
//               onChange={(e) => setLength(parseFloat(e.target.value))}
//               className="col-span-3"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="height" className="text-right">Height</Label>
//             <Input
//               id="height"
//               type="number"
//               value={height}
//               onChange={(e) => setHeight(parseFloat(e.target.value))}
//               className="col-span-3"
//             />
//           </div>
//         </div>
//         <DialogFooter>
//           <Button onClick={handleSave}>Save changes</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }

// // Main UnityStyleEditor component
// export default function UnityStyleEditor() {
//   // State management with undo/redo functionality
//   const [furniture, updateFurniture, undo, redo] = useUndoRedo([])
//   const [selectedItem, setSelectedItem] = useState(null)
//   const [transformMode, setTransformMode] = useState('translate')
//   const [isDarkMode, setIsDarkMode] = useState(false)
//   const [room, setRoom] = useState({ width: 5, length: 5, height: 3 })
//   const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(true)

//   // Function to add new furniture
//   const addFurniture = (type) => {
//     const newItem = {
//       id: Date.now(),
//       name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${furniture.length + 1}`,
//       model: furnitureModels[type],
//       position: [0, 0, 0],
//       rotation: [0, 0, 0],
//       scale: [1, 1, 1],
//       visible: true,
//     }
//     updateFurniture([...furniture, newItem])
//   }

//   // Function to update furniture transform
//   const updateTransform = (id, type, value) => {
//     updateFurniture(furniture.map(item => 
//       item.id === id ? { ...item, [type]: value } : item
//     ))
//   }

//   // Function to toggle furniture visibility
//   const toggleVisibility = (id) => {
//     updateFurniture(furniture.map(item => 
//       item.id === id ? { ...item, visible: !item.visible } : item
//     ))
//   }

//   // Function to save the current state
//   const saveState = () => {
//     localStorage.setItem('editorState', JSON.stringify({ furniture, room }))
//     alert('State saved!')
//   }

//   // Function to load a saved state
//   const loadState = () => {
//     const savedState = localStorage.getItem('editorState')
//     if (savedState) {
//       const { furniture: savedFurniture, room: savedRoom } = JSON.parse(savedState)
//       updateFurniture(savedFurniture)
//       setRoom(savedRoom)
//       alert('State loaded!')
//     } else {
//       alert('No saved state found!')
//     }
//   }

//   // Function to toggle dark mode
//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode)
//     document.documentElement.classList.toggle('dark')
//   }

//   // Effect to initialize dark mode
//   useEffect(() => {
//     if (isDarkMode) {
//       document.documentElement.classList.add('dark')
//     } else {
//       document.documentElement.classList.remove('dark')
//     }
//   }, [isDarkMode])

//   return (
//     <div className="w-full h-screen flex flex-col bg-background text-foreground">
//       <Toolbar
//         onAddFurniture={addFurniture}
//         transformMode={transformMode}
//         setTransformMode={setTransformMode}
//         onUndo={undo}
//         onRedo={redo}
//         onSave={saveState}
//         onLoad={loadState}
//         isDarkMode={isDarkMode}
//         toggleDarkMode={toggleDarkMode}
//         onOpenRoomDialog={() => setIsRoomDialogOpen(true)}
//       />
//       <div className="flex-1 flex">
//         <div className="w-64 bg-background border-r">
//           <Hierarchy
//             furniture={furniture}
//             selectedItem={selectedItem}
//             onSelectItem={setSelectedItem}
//             onToggleVisibility={toggleVisibility}
//           />
//         </div>
//         <div className="flex-1">
//           <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
//             <Suspense fallback={null}>
//               <SceneView
//                 room={room}
//                 furniture={furniture.filter(item => item.visible)}
//                 selectedItem={selectedItem}
//                 onSelectItem={setSelectedItem}
//                 onUpdateTransform={updateTransform}
//                 transformMode={transformMode}
//               />
//             </Suspense>
//           </Canvas>
//         </div>
//         <div className="w-64 bg-background border-l">
//           <Tabs defaultValue="inspector">
//             <TabsList className="w-full">
//               <TabsTrigger value="inspector" className="flex-1">Inspector</TabsTrigger>
//               <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
//             </TabsList>
//             <TabsContent value="inspector">
//               <Inspector
//                 selectedItem={selectedItem}
//                 furniture={furniture}
//                 onUpdateTransform={updateTransform}
//               />
//             </TabsContent>
//             <TabsContent value="settings">
//               <div className="p-4 space-y-4">
//                 <div>
//                   <Label>Grid Size</Label>
//                   <Slider defaultValue={[10]} max={20} step={1} />
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Switch id="show-stats" />
//                   <Label htmlFor="show-stats">Show Stats</Label>
//                 </div>
//                 <div>
//                   <Label>Environment</Label>
//                   <Select>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select environment" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="apartment">Apartment</SelectItem>
//                       <SelectItem value="studio">Studio</SelectItem>
//                       <SelectItem value="sunset">Sunset</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//       <RoomDialog
//         open={isRoomDialogOpen}
//         onOpenChange={setIsRoomDialogOpen}
//         onSave={setRoom}
//       />
//     </div>
//   )
// }