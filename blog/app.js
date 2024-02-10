const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const {MONGODB_URI} = require('./utils/config');
const logger = require('./utils/logger');
const {userExtractor, tokenExtractor} = require('./middleware');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');


const app = express();

mongoose.set('strictQuery', false);

logger.info('connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => 
  {
    logger.info('connected to MongoDB');
  })
  .catch((error) => 
  {
    logger.error('error connecting to MongoDB:', error.message);
  })
  
  
  

app.use(cors());
app.use(express.json());
app.use(tokenExtractor);
app.use('/api/blogs', userExtractor, blogsRouter);
app.use('/api/users', usersRouter);
app.use('/login', loginRouter);

module.exports = app;