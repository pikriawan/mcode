import { useState } from 'react'
import EditorContext from './editor-context'

export default function EditorProvider({ children }) {
  const [openFiles, setOpenFiles] = useState([])

  return (
    <EditorContext.Provider value={{ openFiles, setOpenFiles }}>
      {children}
    </EditorContext.Provider>
  )
}