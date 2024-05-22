import { useContext } from 'react'
import AppBarContext from './app-bar-context'

export default function useAppBar() {
  const appBar = useContext(AppBarContext)
  return appBar
}