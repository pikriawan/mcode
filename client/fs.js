const ResponseStatus = {
  SUCCESS: 'success',
  ERROR: 'error'
}

export async function stat(path) {
  const response = await fetch(`/api/stat${path}`)
  const {
    status,
    error,
    data
  } = await response.json()

  if (status === ResponseStatus.SUCCESS) {
    return data
  }

  throw error
}

export async function readFile(path) {
  const response = await fetch(`/api/readfile${path}`)
  const {
    status,
    error,
    data
  } = await response.json()

  if (status === ResponseStatus.SUCCESS) {
    return data
  }

  throw error
}

export async function readdir(path) {
  const response = await fetch(`/api/readdir${path}`)
  const {
    status,
    error,
    data
  } = await response.json()

  if (status === ResponseStatus.SUCCESS) {
    return data
  }

  throw error
}

export async function mkdir(path) {
  const response = await fetch('/api/mkdir', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ path })
  })
  const { status, error } = await response.json()

  if (status === ResponseStatus.SUCCESS) {
    return
  }

  throw error
}

export async function touch(path) {
  const response = await fetch(`/api/touch${path}`, {
    method: 'POST'
  })
  const { status, error } = await response.json()

  if (status === ResponseStatus.SUCCESS) {
    return
  }

  throw error
}

export async function writeFile(path, data) {
  const response = await fetch(`/api/writefile${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data })
  })
  const { status, error } = await response.json()

  if (status === ResponseStatus.SUCCESS) {
    return
  }

  throw error
}

export async function cp(src, dest) {
  const response = await fetch(`/api/cp${src}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      path: dest
    })
  })
  const { status, error } = await response.json()

  if (status === ResponseStatus.SUCCESS) {
    return
  }

  throw error
}

export async function rename(oldPath, newPath) {
  const response = await fetch(`/api/rename${oldPath}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      path: newPath
    })
  })
  const { status, error } = await response.json()

  if (status === ResponseStatus.SUCCESS) {
    return
  }

  throw error
}

export async function rm(path) {
  const response = await fetch(`/api/rm${path}`, {
    method: 'DELETE'
  })
  const { status, error } = await response.json()

  if (status === ResponseStatus.SUCCESS) {
    return
  }

  throw error
}