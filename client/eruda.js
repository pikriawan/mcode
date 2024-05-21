const isProduction = import.meta.env.MODE === 'production'

if (!isProduction) {
  const eruda = await import('eruda')
  eruda.init({
    defaults: {
      displaySize: 60,
      theme: 'Dark'
    }
  })
}