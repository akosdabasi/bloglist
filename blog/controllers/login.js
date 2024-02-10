const loginRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {ACCESS_TOKEN_SECRET} = require('../utils/config');

loginRouter.post('/', async (request, response) => 
{
  const {username, password} = request.body;
  const user = await User.findOne({username});
  if(user === null)
    return response.status(400).send("username doesn't exist");

  if(!bcrypt.compare(password, user.password))
    return response.status(401).send("wrong password or username");
  
  const userForToken = 
  {
    username: user.username,
    id: user.id,
  }
  const accessToken = jwt.sign(userForToken, ACCESS_TOKEN_SECRET);
  response.json({accessToken});
})

module.exports = loginRouter;