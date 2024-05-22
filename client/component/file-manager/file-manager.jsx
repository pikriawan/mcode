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
import { useEffect, useState } from 'react'
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
  const [baseExists, setBaseExists] = useState()
  const [float, setFloat] = useState()
  const [cutItemParent, setCutItemParent] = useState()
  const [deletedItemParent, setDeletedItemParent] = useState()
  const [dialogOpen, setDialogOpen] = useState(false)

  async function handleOpenFolder(event) {
    event.preventDefault()
    const data = new FormData(event.target)
    const baseFolderPath = data.get('baseFolderPath')

    try {
      const { type } = await fs.stat(baseFolderPath)

      if (type === DirentType.DIRECTORY) {
        setBase(baseFolderPath)
      } else {
        throw Error
      }
    } catch (error) {
      alert(error)
    }

    setDialogOpen(false)
  }

  useEffect(() => {
    async function checkBaseExists() {
      if (base && baseExists === undefined) {
        try {
          await fs.stat(base)
          setBaseExists(true)
        } catch {
          setBase(null)
          setBaseExists(false)
        }
      }
    }

    checkBaseExists()
  }, [base, baseExists])

  useEffect(() => {
    if (base && baseExists !== undefined) {
      localStorage.setItem('base', base)
    } else {
      localStorage.removeItem('base')
    }
  }, [base, baseExists])

  return base && baseExists !== undefined
    ? (
        <FileManagerContext.Provider value={{
          base,
          setBase,
          float,
          setFloat,
          cutItemParent,
          setCutItemParent,
          deletedItemParent,
          setDeletedItemParent
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
                backgroundImage: 'none'
              }
            }}
          >
            <form onSubmit={handleOpenFolder}>
              <DialogTitle>
                Open folder
              </DialogTitle>
              <DialogContent>
                <TextField
                  autoComplete='off'
                  name='baseFolderPath'
                  required
                  type='text'
                  variant='outlined'
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setDialogOpen(false)}
                  variant='outlined'
                >
                  Cancel
                </Button>
                <Button
                  disableElevation
                  type='submit'
                  variant='contained'
                >Open</Button>
              </DialogActions>
            </form>
          </Dialog>
        </>
      )
}