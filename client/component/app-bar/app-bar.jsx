import { Menu as MenuIcon } from '@mui/icons-material'
import {
  AppBar as MuiAppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar
} from '@mui/material'
import { useState } from 'react'
import { FileManager } from '..'

export default function AppBar() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
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
            width: 0.75
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
    </>
  )
}