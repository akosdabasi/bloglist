const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt  = require('bcrypt');


usersRouter.get('/', async (request, response) => 
{
  const users = await User.find({}).populate('blogs', {title:1, url:1});
  console.log(users);
  response.json(users);
})

usersRouter.post('/', async (request, response) => 
{
  const {username, password, name} = request.body;
  if(!username || !password)
   return response.status(400).end();

  const user = await User.findOne({username});

  if(user !== null)
    return response.status(400).send('username already exists.');

  if(username.length < 3 || password.length < 3)
    return response.status(400).send('username and password must be at least 3 characters long.');

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await User.create(
    {
      username,
      name: name || username, 
      passwordHash
    }); 

  response.status(201).json(newUser);
})

module.exports = usersRouter;