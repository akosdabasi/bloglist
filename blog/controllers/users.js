const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt  = require('bcrypt');

usersRouter.get('/', async (request, response) => 
{
  const users = await User.find({});
  response.json(users);
})

usersRouter.post('/', async (request, response) => 
{
  const body = request.body;
  if(!body.username || !body.password)
   return response.status(400).end();

  const username = body.username;
  const user = await User.find({username});

  if(user.length)
    return response.status(400).send('username already exists.');

  if(username.length < 3 || body.password.length < 3)
    return response.status(400).send('username and password must be at least 3 characters long.');

  const name = body.name || username;
  const password = await bcrypt.hash(body.password, 10);
  const newUser = await User.create({username, name, password}); 
  response.status(201).json(newUser);
})

module.exports = usersRouter;