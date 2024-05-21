import { useContext } from 'react'
import EditorContext from './editor-context'

export default function useEditor() {
  const editor = useContext(EditorContext)
  return editor
}