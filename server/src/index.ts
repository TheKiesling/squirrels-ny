import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import squirrelRoutes from './routes/squirrelRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Squirrels API is running' })
})

app.use('/api/squirrels', squirrelRoutes)

app.listen(PORT, () => {
  console.log(`🐿️  Server running on port ${PORT}`)
})

