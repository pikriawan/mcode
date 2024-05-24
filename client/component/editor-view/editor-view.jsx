import { Box } from '@mui/material'
import {
  useEffect,
  useRef,
  useState
} from 'react'
import { useEditor } from '..'
import { useApp } from '../../app'
import * as fs from '../../fs'

export default function EditorView({ path }) {
  const [value, setValue] = useState()
  const editorRef = useRef()
  const saveTimeout = useRef()
  const saveDelay = 1000
  const {
    setSnackbarOpen,
    setSnackbarMessage,
    setSnackbarAlertSeverity
  } = useApp()

  useEffect(() => {
    async function loadFile() {
      try {
        const data = await fs.readFile(path)
        setValue(data)
        editorRef.current.innerText = data
      } catch (error) {
        setSnackbarOpen(true)
        setSnackbarMessage(error?.code || error.message)
        setSnackbarAlertSeverity('error')
      }
    }

    loadFile()
  }, [])

  async function save() {
    try {
      await fs.writeFile(path, value)
    } catch (error) {
      setSnackbarOpen(true)
      setSnackbarMessage(error?.code || error.message)
      setSnackbarAlertSeverity('error')
    }
  }

  useEffect(() => {
    clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(save, saveDelay)
  }, [value])

  return (
    <div
      contentEditable
      onInput={(event) => setValue(event.target.innerText)}
      ref={editorRef}
      style={{
        backgroundColor: '121212',
        boxSizing: 'border-box',
        color: '#F6F6F6',
        fontFamily: 'monospace',
        height: '100%',
        outline: 'none',
        padding: '1rem',
        width: '100%'
      }}
    >
    </div>
  )
}