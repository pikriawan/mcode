import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, GlobalStyles } from '@mui/material'
import {
  AppBar,
  Editor,
  EditorProvider
} from './component'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#F6F6F6'
    },
    text: {
      primary: '#D1D1D1'
    }
  }
})

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{
        'html, body, #app': {
          height: '100%',
          width: '100%'
        }
      }} />
      <EditorProvider>
        <AppBar />
        <main>
          <Editor />
        </main>
      </EditorProvider>
    </ThemeProvider>
  )
}