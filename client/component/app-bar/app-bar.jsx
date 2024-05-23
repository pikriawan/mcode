import { Menu as MenuIcon } from '@mui/icons-material'
import {
  AppBar as MuiAppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  useMediaQuery
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'
import { FileManager } from '..'
import AppBarContext from './app-bar-context'

export default function AppBar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const theme = useTheme()

  return (
    <AppBarContext.Provider value={{ drawerOpen, setDrawerOpen }}>
      <MuiAppBar sx={{
        backgroundImage: 'none',
        boxShadow: 'none'
      }}>
        <Toolbar>
          <IconButton onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </MuiAppBar>
      <Toolbar />
      <Drawer
        ModalProps={{
          keepMounted: true
        }}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundImage: 'none',
            boxShadow: 'none',
            width: useMediaQuery(theme.breakpoints.up('sm'))
              ? '20rem'
              : 0.75
          }
        }}
      >
        <Box sx={{
          height: '100%',
          overflowY: 'scroll',
          width: '100%'
        }}>
          <FileManager />
        </Box>
      </Drawer>
    </AppBarContext.Provider>
  )
}