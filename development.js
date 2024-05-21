import nodemon from 'nodemon'

nodemon({
  script: 'server/server',
  ext: 'js',
  watch: ['server']
})

nodemon.on('start', () => {
  console.log('[nodemon] start')
})

nodemon.on('restart', () => {
  console.log('[nodemon] restart')
})

nodemon.on('quit', () => {
  console.log('[nodemon] quit')
  process.exit(1)
})