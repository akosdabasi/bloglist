const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const {MONGODB_URI, PORT} = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')


const app = express();

mongoose.set('strictQuery', false)

logger.info('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogsRouter);

module.exports = app;