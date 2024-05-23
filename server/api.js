import fs from 'node:fs'
import express from 'express'

const api = express.Router()

const ResponseStatus = {
  SUCCESS: 'success',
  ERROR: 'error'
}

const DirentType = {
  DIRECTORY: 'directory',
  FILE: 'file'
}

const ErrorCode = {
  EACCES: 'EACCES',
  EEXIST: 'EEXIST',
  EISDIR: 'EISDIR',
  ENOENT: 'ENOENT',
  EROFS: 'EROFS'
}

api.get('/stat/*', (req, res) => {
  const path = `/${req.params['0']}`

  try {
    const data = fs.statSync(path, 'utf-8')
    res.json({
      status: ResponseStatus.SUCCESS,
      error: null,
      data: {
        type: data.isDirectory() ? DirentType.DIRECTORY : DirentType.FILE
      }
    })
  } catch (error) {
    if (error.code === ErrorCode.EACCES) {
      res.status(400)
    } else if (error.code === ErrorCode.ENOENT) {
      res.status(404)
    } else {
      res.status(500)
    }

    res.json({
      status: ResponseStatus.ERROR,
      error,
      data: null
    })
  }
})

api.get('/readfile/*', (req, res) => {
  const path = `/${req.params['0']}`

  try {
    const data = fs.readFileSync(path, 'utf-8')
    res.json({
      status: ResponseStatus.SUCCESS,
      error: null,
      data
    })
  } catch (error) {
    if (
      error.code === ErrorCode.EACCES ||
      error.code === ErrorCode.EISDIR
    ) {
      res.status(400)
    } else if (error.code === ErrorCode.ENOENT) {
      res.status(404)
    } else {
      res.status(500)
    }

    res.json({
      status: ResponseStatus.ERROR,
      error,
      data: null
    })
  }
})

api.get('/readdir/*', (req, res) => {
  const path = `/${req.params['0']}`

  try {
    const children = fs.readdirSync(path)
    const details = children
      .map((child) => {
        const abs = `${path}/${child}`
        const isDirectory = fs.statSync(abs).isDirectory()
        return {
          name: child,
          path: abs,
          type: isDirectory ? DirentType.DIRECTORY : DirentType.FILE
        }
      })
      .sort((a, b) => {
        if (a.type === b.type) {
          return 0
        } else if (a.type === DirentType.DIRECTORY) {
          return -1
        } else {
          return 1
        }
      })

    res.json({
      status: ResponseStatus.SUCCESS,
      error: null,
      data: details
    })
  } catch (error) {
    if (error.code === ErrorCode.EACCES) {
      res.status(400)
    } else if (error.code === ErrorCode.ENOENT) {
      res.status(404)
    } else {
      res.status(500)
    }

    res.json({
      status: ResponseStatus.ERROR,
      error,
      data: null
    })
  }
})

api.post('/mkdir', (req, res) => {
  const { path } = req.body

  if (!path) {
    res.status(400).json({
      status: ResponseStatus.ERROR,
      error: 'empty path',
      data: null
    })
    return
  }

  try {
    fs.mkdirSync(path)
    res.json({
      status: ResponseStatus.SUCCESS,
      error: null,
      data: null
    })
  } catch (error) {
    if (
      error.code === ErrorCode.EACCES ||
      error.code === ErrorCode.EEXIST ||
      error.code === ErrorCode.EROFS
    ) {
      res.status(400)
    } else if (error.code === ErrorCode.ENOENT) {
      res.status(404)
    } else {
      res.status(500)
    }

    res.json({
      status: ResponseStatus.ERROR,
      error,
      data: null
    })
  }
})

api.post('/touch/*', (req, res) => {
  const path = `/${req.params['0']}`

  try {
    fs.writeFileSync(path, '')
    res.json({
      status: ResponseStatus.SUCCESS,
      error: null,
      data: null
    })
  } catch (error) {
    if (
      error.code === ErrorCode.EACCES ||
      error.code === ErrorCode.EISDIR ||
      error.code === ErrorCode.EROFS
    ) {
      res.status(400)
    } else if (error.code === ErrorCode.ENOENT) {
      res.status(404)
    } else {
      res.status(500)
    }

    res.json({
      status: ResponseStatus.ERROR,
      error,
      data: null
    })
  }
})

api.put('/writefile/*', (req, res) => {
  const path = `/${req.params['0']}`
  const { data } = req.body

  if (!fs.existsSync(path)) {
    res.status(400).json({
      status: ResponseStatus.ERROR,
      error: 'file doesn\'t exist',
      data: null
    })
    return
  }

  try {
    fs.writeFileSync(path, data || '')
    res.json({
      status: ResponseStatus.SUCCESS,
      error: null,
      data: null
    })
  } catch (error) {
    if (
      error.code === ErrorCode.EACCES ||
      error.code === ErrorCode.EISDIR ||
      error.code === ErrorCode.EROFS
    ) {
      res.status(400)
    } else if (error.code === ErrorCode.ENOENT) {
      res.status(404)
    } else {
      res.status(500)
    }

    res.json({
      status: ResponseStatus.ERROR,
      error,
      data: null
    })
  }
})

api.put('/cp/*', (req, res) => {
  const src = `/${req.params['0']}`
  const { path: dest } = req.body

  if (!dest) {
    res.status(400).json({
      status: ResponseStatus.ERROR,
      error: 'empty path',
      data: null
    })
    return
  }

  try {
    fs.cpSync(src, dest, {
      recursive: true
    })
    res.json({
      status: ResponseStatus.SUCCESS,
      error: null,
      data: null
    })
  } catch (error) {
    if (
      error.code === ErrorCode.EACCES ||
      error.code === ErrorCode.EISDIR ||
      error.code === ErrorCode.EROFS
    ) {
      res.status(400)
    } else if (error.code === ErrorCode.ENOENT) {
      res.status(404)
    } else {
      res.status(500)
    }

    res.json({
      status: ResponseStatus.ERROR,
      error,
      data: null
    })
  }
})

api.put('/rename/*', (req, res) => {
  const oldPath = `/${req.params['0']}`
  const { path: newPath } = req.body

  if (!newPath) {
    res.status(400).json({
      status: ResponseStatus.ERROR,
      error: 'empty path',
      data: null
    })
    return
  }

  try {
    fs.renameSync(oldPath, newPath)
    res.json({
      status: ResponseStatus.SUCCESS,
      error: null,
      data: null
    })
  } catch (error) {
    if (
      error.code === ErrorCode.EACCES ||
      error.code === ErrorCode.EROFS
    ) {
      res.status(400)
    } else if (error.code === ErrorCode.ENOENT) {
      res.status(404)
    } else {
      res.status(500)
    }

    res.json({
      status: ResponseStatus.ERROR,
      error,
      data: null
    })
  }
})

api.delete('/rm/*', (req, res) => {
  const path = `/${req.params['0']}`

  try {
    fs.rmSync(path, {
      recursive: true
    })
    res.json({
      status: ResponseStatus.SUCCESS,
      error: null,
      data: null
    })
  } catch (error) {
    if (
      error.code === ErrorCode.EACCES ||
      error.code === ErrorCode.EROFS
    ) {
      res.status(400)
    } else if (error.code === ErrorCode.ENOENT) {
      res.status(404)
    } else {
      res.status(500)
    }

    res.json({
      status: ResponseStatus.ERROR,
      error,
      data: null
    })
  }
})

export default api