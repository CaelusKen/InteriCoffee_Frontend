import { useState, useCallback, useRef, useEffect } from 'react'

export function useUndoRedo<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState)
  const undoStack = useRef<T[]>([])
  const redoStack = useRef<T[]>([])

  const undo = useCallback(() => {
    if (undoStack.current.length > 0) {
      const prevState = undoStack.current.pop()!
      redoStack.current.push(state)
      setState(prevState)
    }
  }, [state])

  const redo = useCallback(() => {
    if (redoStack.current.length > 0) {
      const nextState = redoStack.current.pop()!
      undoStack.current.push(state)
      setState(nextState)
    }
  }, [state])

  const update = useCallback((newState: T) => {
    undoStack.current.push(state)
    redoStack.current = []
    setState(newState)
  }, [state])

  const canUndo = undoStack.current.length > 0
  const canRedo = redoStack.current.length > 0

  return [state, update, undo, redo, canUndo, canRedo] as const
}