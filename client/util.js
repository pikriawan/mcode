export function getName(path) {
  return path.split('/').slice(-1).join('')
}

export function getParentPath(path) {
  let result = path.split('/')
  result.pop()
  result = result.join('/')
  return result
}