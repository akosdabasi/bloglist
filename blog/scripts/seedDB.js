const mongoose = require('mongoose');
const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcrypt');
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

const testUsers = 
[
  {
    name: "Ákos Dabasi",
    username:"akosdabasi",
    password:"root"
  },
  {
    name: "Zsolt Nagy",
    username:"zsoltnagy",
    password:"root1"
  },
  {
    name: "Márk Kiss",
    username:"márkkiss",
    password:"root3"
  },
  {
    name: "Gergő Sisak",
    username:"gergősisak",
    password:"root4"
  }
];

const Seed = async () =>
{
  await Blog.deleteMany({});
  await User.deleteMany({});
  const testUsersHashed = await Promise.all(testUsers.map(async user => {
    user.password = await bcrypt.hash(user.password, 10);
    return user;
  }));
  
  await User.create(testUsersHashed);
  
};

Seed().then(() => 
{
  mongoose.connection.close();
})