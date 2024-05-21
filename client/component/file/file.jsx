import { InsertDriveFileOutlined as InsertDriveFileOutlinedIcon, MoreVert as MoreVertIcon } from '@mui/icons-material'
import {
  ButtonBase,
  Box,
  Dialog,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Typography
} from '@mui/material'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import { useEditor, useFileManager } from '..'
import * as fs from '../../fs'
import { getName, getParentPath } from '../../util'

const FileContext = createContext()

function OptionsAction({
  disableDivider,
  children,
  ...props
}) {
  return (
    <>
      {!disableDivider && <Divider />}
      <ButtonBase {...props}>
        <Typography>
          {children}
        </Typography>
      </ButtonBase>
    </>
  )
}

function OptionsDialog({ onClose, open }) {
  const { path } = useContext(FileContext)
  const { float, setFloat } = useFileManager()
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <>
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>
          {getName(path)}
        </DialogTitle>
        <OptionsAction disableDivider onClick={() => {
          setFloat({
            type: 'copy',
            path
          })
          onClose()
        }}>
          Copy
        </OptionsAction>
        <OptionsAction onClick={() => {
          setFloat({
            type: 'cut',
            path
          })
          onClose()
        }}>
          Cut
        </OptionsAction>
        <OptionsAction onClick={() => {
          setRenameDialogOpen(true)
          onClose()
        }}>
          Rename
        </OptionsAction>
        <OptionsAction onClick={() => {
          setDeleteDialogOpen(true)
          onClose()
        }}>
          Delete
        </OptionsAction>
        {float?.path === path && (
          <OptionsAction onClick={() => {
            setFloat(null)
            onClose()
          }}>
            Cancel {float.type}
          </OptionsAction>
        )}
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
    <Dialog onClose={onClose} open={open}>
      <form onSubmit={handleRename}>
        <TextField
          autoComplete='off'
          defaultValue={getName(path)}
          label='New name'
          name='name'
          variant='outlined'
        />
        <ButtonBase type='submit'>Rename</ButtonBase>
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
    <Dialog onClose={onClose} open={open}>
      <form onSubmit={handleDelete}>
        <ButtonBase type='submit'>Yes</ButtonBase>
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