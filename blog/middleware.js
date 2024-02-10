const jwt = require('jsonwebtoken');
const User = require('./models/user');
const {ACCESS_TOKEN_SECRET} = require('./utils/config');

const getTokenFrom = request => 
{
  const authorization = request.get('authorization');
  const isAuthSchemaCorrect = authorization && authorization.startsWith('Bearer ');
  
  
  return isAuthSchemaCorrect ? authorization.replace('Bearer ', '') : null;
}

const getUserFromToken = async token => 
{
  if(token === null)
    return null;

  const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
  if (!decodedToken.id) 
    return null;
  
  return await User.findById(decodedToken.id);
}

const tokenExtractor = (request, response, next) => {

  const token = getTokenFrom(request);
  request.token = token;
  next()
}

const userExtractor = async (request, response, next) => {
  // code that extracts the token
  const user = await getUserFromToken(request.token);
  request.user = user;
  next()
}

module.exports = {tokenExtractor,userExtractor}