import { useEffect, useState } from 'react'
import { useEditor } from '..'
import * as fs from '../../fs'

export default function EditorView({ path }) {
  const { openFiles, setOpenFiles } = useEditor()
  const [value, setValue] = useState()

  useEffect(() => {
    async function loadFile() {
      try {
        const data = await fs.readFile(path)
        setValue(data)
      } catch (error) {
        console.error(error)
      }
    }

    loadFile()
  }, [])

  return value !== undefined ? (
    <>
      <textarea defaultValue={value} onInput={(event) => setValue(event.target.value)}></textarea>
      <button onClick={async function() {
        await fs.writeFile(path, value)
      }}>Save</button>
      <button onClick={() => {
        setOpenFiles((prev) => prev.filter((filePath) => filePath !== path))
      }}>Close</button>
    </>
  ) : undefined
}