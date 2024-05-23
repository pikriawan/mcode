import { ThemeProvider, createTheme } from '@mui/material/styles'
import {
  Alert,
  CssBaseline,
  GlobalStyles,
  Snackbar
} from '@mui/material'
import {
  createContext,
  useContext,
  useState
} from 'react'
import {
  AppBar,
  Editor,
  EditorProvider
} from './component'

const AppContext = createContext()

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

export function useApp() {
  const app = useContext(AppContext)
  return app
}

export default function App() {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarAlertSeverity, setSnackbarAlertSeverity] = useState('success')

  return (
    <AppContext.Provider value={{
      snackbarOpen,
      setSnackbarOpen,
      snackbarMessage,
      setSnackbarMessage,
      snackbarAlertSeverity,
      setSnackbarAlertSeverity
    }}>
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
        <Snackbar
          autoHideDuration={5000}
          onClose={() => setSnackbarOpen(false)}
          open={snackbarOpen}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarAlertSeverity}
            variant='filled'
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </AppContext.Provider>
  )
}