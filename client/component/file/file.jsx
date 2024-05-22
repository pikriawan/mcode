import { InsertDriveFileOutlined as InsertDriveFileOutlinedIcon, MoreVert as MoreVertIcon } from '@mui/icons-material'
import {
  Box,
  Button,
  ButtonBase,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material'
import {
  createContext,
  useCallback,
  useContext,
  useState
} from 'react'
import {
  useAppBar,
  useEditor,
  useFileManager
} from '..'
import * as fs from '../../fs'
import { getName, getParentPath } from '../../util'

const FileContext = createContext()

function OptionsDialog({ onClose, open }) {
  const { path } = useContext(FileContext)
  const { float, setFloat } = useFileManager()
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <>
      <Dialog
        onClose={onClose}
        open={open}
        sx={{
          '& .MuiDialog-paper': {
            backgroundImage: 'none'
          }
        }}
      >
        <DialogTitle>
          {getName(path)}
        </DialogTitle>
        <DialogContent>
          <ButtonGroup
            orientation='vertical'
            variant='text'
            sx={{
              width: '100%'
            }}
          >
            <Button onClick={() => {
              setFloat({
                type: 'copy',
                path
              })
              onClose()
            }}>
              Copy
            </Button>
            <Button onClick={() => {
              setFloat({
                type: 'cut',
                path
              })
              onClose()
            }}>
              Cut
            </Button>
            <Button onClick={() => {
              setRenameDialogOpen(true)
              onClose()
            }}>
              Rename
            </Button>
            <Button onClick={() => {
              setDeleteDialogOpen(true)
              onClose()
            }}>
              Delete
            </Button>
            {float?.path === path && (
              <Button onClick={() => {
                setFloat(null)
                onClose()
              }}>
                Cancel {float.type}
              </Button>
            )}
          </ButtonGroup>
        </DialogContent>
      </Dialog>
      <RenameDialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)} />
      <DeleteDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} />
    </>
  )
}

function RenameDialog({ onClose, open }) {
  const { path, setPath } = useContext(FileContext)

  const handleRename = useCallback(async (event) => {
    event.preventDefault()

    try {
      const formData = new FormData(event.target)
      const name = formData.get('name')
      const newPath = `${getParentPath(path)}/${name}`
      await fs.rename(path, newPath)
      setPath(newPath)

      if (onClose) {
        onClose()
      }
    } catch (error) {
      console.error(error)
    }
  }, [path])

  return (
    <Dialog
      onClose={onClose}
      open={open}
      sx={{
        '& .MuiDialog-paper': {
          backgroundImage: 'none'
        }
      }}
    >
      <form onSubmit={handleRename}>
        <DialogTitle>
          Rename
        </DialogTitle>
        <DialogContent>
          <TextField
            autoComplete='off'
            defaultValue={getName(path)}
            name='name'
            variant='outlined'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose()} variant='outlined'>
            Cancel
          </Button>
          <Button type='submit' variant='contained'>
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

function DeleteDialog({ onClose, open }) {
  const { path, setIsDeleted } = useContext(FileContext)

  const handleDelete = useCallback(async (event) => {
    event.preventDefault()

    try {
      await fs.rm(path)
      setIsDeleted(true)
    } catch (error) {
      console.error(error)
    }
  }, [path])

  return (
    <Dialog
      onClose={onClose}
      open={open}
      sx={{
        '& .MuiDialog-paper': {
          backgroundImage: 'none'
        }
      }}
    >
      <form onSubmit={handleDelete}>
        <DialogTitle>
          Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Delete file?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose()} variant='outlined'>
            Cancel
          </Button>
          <Button type='submit' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default function File({
  path: originalPath
}) {
  const [path, setPath] = useState(originalPath)
  const [optionsDialogOpen, setOptionsDialogOpen] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)
  const { setDrawerOpen } = useAppBar()
  const { openFiles, setOpenFiles } = useEditor()

  return isDeleted ? undefined : (
    <FileContext.Provider value={{
      path,
      setPath,
      setIsDeleted
    }}>
      <Box sx={{
        display: 'flex'
      }}>
        <ButtonBase
          onClick={() => {
            if (!openFiles.includes(path)) {
              setOpenFiles((prev) => [
                ...prev,
                path
              ])
            }

            setDrawerOpen(false)
          }}
          sx={{
            fontSize: '1rem',
            gap: '0.5rem',
            height: '3rem',
            justifyContent: 'flex-start',
            overflowX: 'hidden',
            padding: '0 1rem',
            width: '100%'
          }}
        >
          <InsertDriveFileOutlinedIcon />
          <Typography noWrap variant='body1'>
            {getName(path)}
          </Typography>
        </ButtonBase>
        <ButtonBase
          onClick={() => {
            setOptionsDialogOpen(true)
          }}
          sx={{
            height: '3rem',
            minWidth: '3rem',
            padding: 0
          }}
        >
          <MoreVertIcon sx={{
            height: '1.25rem',
            width: '1.25rem'
          }} />
        </ButtonBase>
      </Box>
      <OptionsDialog open={optionsDialogOpen} onClose={() => setOptionsDialogOpen(false)} />
    </FileContext.Provider>
  )
}