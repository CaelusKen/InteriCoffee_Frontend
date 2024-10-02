import { useState, useCallback } from 'react'

export function useUndoRedo<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState)
  const [undoStack, setUndoStack] = useState<T[]>([])
  const [redoStack, setRedoStack] = useState<T[]>([])

  const undo = useCallback(() => {
    if (undoStack.length > 0) {
      const prevState = undoStack[undoStack.length - 1]
      setUndoStack(undoStack.slice(0, -1))
      setRedoStack([state, ...redoStack])
      setState(prevState)
    }
  }, [state, undoStack, redoStack])

  const redo = useCallback(() => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0]
      setRedoStack(redoStack.slice(1))
      setUndoStack([...undoStack, state])
      setState(nextState)
    }
  }, [state, undoStack, redoStack])

  const update = useCallback((newState: T) => {
    setUndoStack([...undoStack, state])
    setRedoStack([])
    setState(newState)
  }, [state, undoStack])

  return [state, update, undo, redo] as const
}