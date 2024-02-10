const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const {ACCESS_TOKEN_SECRET} = require('../utils/config');

mongoose.set("bufferTimeoutMS", 10000);
const api = supertest(app);

describe('#Login', () => 
{
  test('user can log in with proper credentials', async () => 
  {
    const testUser = await User.findOne({username:'akosdabasi'});
    expect(testUser).not.toBe(null);

    const credentials = 
    {
      username: 'akosdabasi',
      password: 'root'
    };

    const response = await api.post('/login').send(credentials);
    const token = response.body.accessToken;
    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
    expect(decodedToken.id).toBe(testUser._id.toString());
  })
})

afterAll(async () => 
{
  await mongoose.connection.close()
});