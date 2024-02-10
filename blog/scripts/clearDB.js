const mongoose = require('mongoose');
const Blog = require('../models/blog');
const User = require('../models/user');
const {MONGODB_URI} = require('../utils/config');
const logger = require('../utils/logger');

mongoose.connect(MONGODB_URI)
  .then(() => 
  {
    logger.info('connected to MongoDB');
  })
  .catch((error) => 
  {
    logger.error('error connecting to MongoDB:', error.message);
  })

const Seed = async () =>
{
  await Blog.deleteMany({});
  await User.deleteMany({});
};

Seed().then(() => 
{
  mongoose.connection.close();
})