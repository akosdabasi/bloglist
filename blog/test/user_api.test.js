const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');

mongoose.set("bufferTimeoutMS", 10000);
const api = supertest(app);

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
]

beforeEach(async ()=>
{
  await User.deleteMany({});
  await User.create(testUsers);
});

describe("Users API", () => 
{
  describe("#GET", () => 
  { 
    test('users are returned as json', async () => 
    {
      await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });

    test('there are 4 users', async () => 
    {
      const response = await api.get('/api/users');
      expect(response.body).toHaveLength(testUsers.length);
    });

    test('a specific user is within the returned users', async () => 
    {
      const response = await api.get('/api/users');
      const usernames = response.body.map(user => user.username);
      expect(usernames).toContainEqual(testUsers[0].username);
      expect(usernames).toContainEqual(testUsers[3].username);
    })

  })
  describe("#POST", () => 
  { 
    test('users can be created', async () => 
    {
      const newUser = 
      {
        name: "Ottó Káposztás",
        username: "kaposztas",
        password: "uborka"
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)

      const response = await api.get('/api/users');
      const usernames = response.body.map(user => user.username);
      expect(usernames).toContainEqual(newUser.username);
    });

    test('username and password must be given', async () => 
    {
      
      let newUser = 
      {
        name: "Ottó Káposztás",
        password: "uborka"
      }
      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      newUser = 
      {
        name: "Ottó Káposztás",
        username: "kaposztas"
      }
      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
    });

    test('username and password has to be 3 characters long', async () => 
    {
      let newUser = 
      {
        name: "Ottó Káposztás",
        username: "ka",
        password: "uborka"
      }
      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      newUser = 
      {
        name: "Ottó Káposztás",
        username: "kaposztas",
        password: "ub"
      }
      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
  
    })
  })
});

afterAll(async () => {
  await mongoose.connection.close()
})