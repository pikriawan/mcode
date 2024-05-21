import {
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  ButtonBase,
  Dialog,
  DialogTitle,
  Divider,
  TextField,
  Typography
} from '@mui/material'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import { File, useFileManager } from '..'
import * as fs from '../../fs'
import { getName, getParentPath } from '../../util'

const DirentType = {
  DIRECTORY: 'directory',
  FILE: 'file'
}

const FolderContext = createContext()

function OptionsDialog({ onClose, open }) {
  const { path, loadChildren } = useContext(FolderContext)
  const {
    base,
    setBase,
    float,
    setFloat,
    setCutParent
  } = useFileManager()
  const [folderNewDialogOpen, setFolderNewDialogOpen] = useState(false)
  const [fileNewDialogOpen, setFileNewDialogOpen] = useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <>
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>
          {getName(path)}
        </DialogTitle>
        <ButtonBase onClick={() => {
          setFolderNewDialogOpen(true)
          onClose()
        }}>
          <Typography>
            New Folder
          </Typography>
        </ButtonBase>
        <Divider />
        <ButtonBase onClick={() => {
          setFileNewDialogOpen(true)
          onClose()
        }}>
          <Typography>
            New File
          </Typography>
        </ButtonBase>
        <Divider />
        <ButtonBase onClick={() => {
          setFloat({
            type: 'copy',
            path
          })
          onClose()
        }}>
          <Typography>
            Copy
          </Typography>
        </ButtonBase>
        <Divider />
        <ButtonBase onClick={() => {
          setFloat({
            type: 'cut',
            path
          })
          onClose()
        }}>
          <Typography>
            Cut
          </Typography>
        </ButtonBase>
        <Divider />
        <ButtonBase onClick={() => {
          setRenameDialogOpen(true)
          onClose()
        }}>
          <Typography>
            Rename
          </Typography>
        </ButtonBase>
        <Divider />
        <ButtonBase onClick={() => {
          setDeleteDialogOpen(true)
          onClose()
        }}>
          <Typography>
            Delete
          </Typography>
        </ButtonBase>
        {float ? (
          <>
            <Divider />
            <ButtonBase onClick={async () => {
              try {
                if (float.type === 'copy') {
                  await fs.cp(float.path, `${path}/${getName(float.path)}`)
                } else {
                  await fs.rename(float.path, `${path}/${getName(float.path)}`)
                  setCutParent(getParentPath(float.path))
                }

                await loadChildren()
                setFloat(null)
                onClose()
              } catch (error) {
                console.error(error)
              }
            }}>
              <Typography>
                Paste
              </Typography>
            </ButtonBase>
            {path === float.path ? (
              <>
                <Divider />
                <ButtonBase onClick={() => {
                  setFloat(null)
                  onClose()
                }}>
                  <Typography>
                    Cancel {float.type}
                  </Typography>
                </ButtonBase>
              </>
            ) : undefined}
          </>
        ) : undefined}
        {base === path ? (
          <>
            <Divider />
            <ButtonBase onClick={() => {
              localStorage.removeItem('base')
              setBase(null)
            }}>
              <Typography>
                Close
              </Typography>
            </ButtonBase>
          </>
        ) : undefined}
      </Dialog>
      <FolderNewDialog open={folderNewDialogOpen} onClose={() => setFolderNewDialogOpen(false)} />
      <FileNewDialog open={fileNewDialogOpen} onClose={() => setFileNewDialogOpen(false)} />
      <RenameDialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)} />
      <DeleteDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} />
    </>
  )
}

function FolderNewDialog({ onClose, open }) {
  const {
    path,
    open: folderOpen,
    loadChildren
  } = useContext(FolderContext)

  const handleFolderNew = useCallback(async (event) => {
    event.preventDefault()

    try {
      const formData = new FormData(event.target)
      const name = formData.get('name')
      const newFolderPath = `${path}/${name}`
      await fs.mkdir(newFolderPath)

      if (folderOpen) {
        loadChildren()
      }

      if (onClose) {
        onClose()
      }
    } catch (error) {
      console.error(error)
    }
  }, [path, folderOpen])

  return (
    <Dialog onClose={onClose} open={open}>
      <form onSubmit={handleFolderNew}>
        <TextField
          autoComplete='off'
          label='New folder'
          name='name'
          variant='outlined'
        />
        <ButtonBase type='submit'>New</ButtonBase>
      </form>
    </Dialog>
  )
}

function FileNewDialog({ onClose, open }) {
  const {
    path,
    open: folderOpen,
    loadChildren
  } = useContext(FolderContext)

  const handleFileNew = useCallback(async (event) => {
    event.preventDefault()

    try {
      const formData = new FormData(event.target)
      const name = formData.get('name')
      const newFilePath = `${path}/${name}`
      await fs.writeFile(newFilePath, '')

      if (folderOpen) {
        loadChildren()
      }

      if (onClose) {
        onClose()
      }
    } catch (error) {
      console.error(error)
    }
  }, [path, folderOpen])

  return (
    <Dialog onClose={onClose} open={open}>
      <form onSubmit={handleFileNew}>
        <TextField
          autoComplete='off'
          label='New file'
          name='name'
          variant='outlined'
        />
        <ButtonBase type='submit'>New</ButtonBase>
      </form>
    </Dialog>
  )
}

function RenameDialog({ onClose, open }) {
  const { path, setPath } = useContext(FolderContext)

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
  const { path, setIsDeleted } = useContext(FolderContext)

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

export default function Folder({
  path: originalPath
}) {
  const [path, setPath] = useState(originalPath)
  const [open, setOpen] = useState(false)
  const [optionsDialogOpen, setOptionsDialogOpen] = useState(false)
  const [children, setChildren] = useState([])
  const [isDeleted, setIsDeleted] = useState(false)
  const { cutParent, setCutParent } = useFileManager()

  const loadChildren = useCallback(async () => {
    try {
      const data = await fs.readdir(path)
      setChildren(data)
    } catch (error) {
      console.error(error)
    }
  }, [path])

  useEffect(() => {
    if (cutParent === path) {
      setCutParent(null)
      loadChildren()
    }
  }, [cutParent])

  return isDeleted ? undefined : (
    <FolderContext.Provider value={{
      path,
      setPath,
      open,
      setIsDeleted,
      loadChildren
    }}>
      <Accordion
        disableGutters
        expanded={open}
        square
        sx={{
          backgroundImage: 'none',
          boxShadow: '0',
          width: '100%',
          '&:before': {
            display: 'none'
          },
          '&.Mui-expanded': {
            margin: 0
          }
        }}
      >
        <Box sx={{
          display: 'flex'
        }}>
          <AccordionSummary
            disableRipple={false}
            onClick={async () => {
              if (!open) {
                await loadChildren()
                setOpen(true)
              } else {
                setOpen(false)
              }
            }}
            sx={{
              width: '100%',
              overflow: 'hidden',
              '& .MuiAccordionSummary-content': {
                alignItems: 'center',
                gap: '0.5rem',
                overflow: 'hidden'
              }
            }}
          >
            {open ? <FolderOpenIcon /> : <FolderIcon />}
            <Typography noWrap variant='body1'>
              {getName(path)}
            </Typography>
          </AccordionSummary>
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
        <AccordionDetails
          sx={{
            padding: 0,
            paddingLeft: '1.5rem'
          }}
        >
          {children?.length > 0 && children.map((child) => (
            <React.Fragment key={child.name}>
              {child.type === DirentType.DIRECTORY
                ? <Folder path={child.path} />
                : <File path={child.path} />}
            </React.Fragment>
          ))}
        </AccordionDetails>
      </Accordion>
      <OptionsDialog open={optionsDialogOpen} onClose={() => setOptionsDialogOpen(false)} />
    </FolderContext.Provider>
  )
}