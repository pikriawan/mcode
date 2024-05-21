import { useContext } from 'react'
import FileManagerContext from './file-manager-context'

export default function useFileManager() {
  const fileManager = useContext(FileManagerContext)
  return fileManager
}