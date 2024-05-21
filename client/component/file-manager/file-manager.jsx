import {
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { Folder } from '..'
import * as fs from '../../fs'
import FileManagerContext from './file-manager-context'

const DirentType = {
  DIRECTORY: 'directory',
  FILE: 'file'
}

const savedBase = localStorage.getItem('base')

export default function FileManager() {
  const [base, setBase] = useState(savedBase)
  const [float, setFloat] = useState()
  const [cutParent, setCutParent] = useState()
  const [dialogOpen, setDialogOpen] = useState(false)

  async function handleOpenFolder(event) {
    event.preventDefault()
    const data = new FormData(event.target)
    const baseFolderPath = data.get('baseFolderPath')

    try {
      const { type } = await fs.stat(baseFolderPath)

      if (type === DirentType.DIRECTORY) {
        setBase(baseFolderPath)
        localStorage.setItem('base', baseFolderPath)
      } else {
        throw Error
      }
    } catch (error) {
      alert('error')
    }

    setDialogOpen(false)
  }

  return base
    ? (
        <FileManagerContext.Provider value={{
          base,
          setBase,
          float,
          setFloat,
          cutParent,
          setCutParent
        }}>
          <Folder path={base} />
        </FileManagerContext.Provider>
      )
    : (
        <>
          <ButtonBase onClick={() => setDialogOpen(true)} sx={{
            height: '100%',
            width: '100%'
          }}>
            <Typography>
              Open folder
            </Typography>
          </ButtonBase>
          <Dialog
            onClose={() => setDialogOpen(false)}
            open={dialogOpen}
            sx={{
              '& .MuiDialog-paper': {
                backgroundColor: 'pallete.background.default',
                backgroundImage: 'none'
              }
            }}
          >
            <form onSubmit={handleOpenFolder}>
              <DialogContent sx={{
                padding: '1.5rem 1.5rem 0.75rem 1.5rem'
              }}>
                <TextField
                  autoComplete='off'
                  label='Base path'
                  name='baseFolderPath'
                  required
                  type='text'
                  variant='standard'
                />
              </DialogContent>
              <DialogActions sx={{
                gap: '1.5rem',
                justifyContent: 'stretch',
                padding: '0.75rem 1.5rem 1.5rem 1.5rem',
                '& > :not(style) ~ :not(style)': {
                  marginLeft: 0
                }
              }}>
                <Button
                  onClick={() => setDialogOpen(false)}
                  sx={{
                    border: 0,
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    padding: '0.5rem 1rem',
                    textTransform: 'none',
                    width: '100%'
                  }}
                  variant='outlined'
                >
                  Cancel
                </Button>
                <Button
                  disableElevation
                  sx={{
                    width: '100%'
                  }}
                  type='submit'
                  variant='contained'
                >Open</Button>
              </DialogActions>
            </form>
          </Dialog>
        </>
      )
}