import { Close as CloseIcon } from '@mui/icons-material'
import {
  Box,
  Tabs,
  Tab,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { EditorView } from '..'
import { getName } from '../../util'
import useEditor from './use-editor'

export default function Editor() {
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const { openFiles, setOpenFiles } = useEditor()

  function handleTabChange(event, index) {
    setCurrentTabIndex(index)
  }

  return (
    <Box sx={{
      height: '100%',
      width: '100%'
    }}>
      <Tabs
        onChange={handleTabChange}
        value={currentTabIndex}
        variant='scrollable'
      >
        {openFiles.length > 0 && openFiles.map((path) => (
          <Tab
            key={path}
            label={
              <Box sx={{
                alignItems: 'center',
                display: 'flex',
                gap: '1rem'
              }}>
                <Typography>
                  {getName(path)}
                </Typography>
                <CloseIcon
                  onClick={() => setOpenFiles((prev) => prev.filter((filePath) => filePath !== path))}
                  sx={{
                    height: '0.75rem',
                    width: '0.75rem'
                  }}
                />
              </Box>
            }
            sx={{
              textTransform: 'none'
            }}
          />
        ))}
      </Tabs>
      <Box sx={{
        height: 'calc(100% - 3rem)',
        width: '100%'
      }}>
        {openFiles.length > 0 && openFiles.map((path, index) => (
          <Box key={path} sx={{
            display: index === currentTabIndex
              ? 'block'
              : 'none',
            height: '100%',
            // temp_overflow
            overflow: 'hidden',
            width: '100%'
          }}>
            <EditorView path={path} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}