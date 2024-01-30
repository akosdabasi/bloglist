const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

mongoose.set("bufferTimeoutMS", 10000)
const api = supertest(app)

const testBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

beforeEach(async ()=>
{
  await Blog.deleteMany({});
  await Blog.create(testBlogs);
})

test('blogs are returned as json', async () => 
{
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
})

test('there are 6 blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(testBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')
  
  const titles = response.body.map(blog => blog.title);
  expect(titles).toContain(testBlogs[0].title)
})

test('there is an \'id\' field', async () => {
  const response = await api.get('/api/blogs')
  
  expect(response.body[0].id).toBeDefined();
})

test('new posts can be added', async () => {
  const newPost = 
  {
    title: "React hooks",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 10,
  }
  const response = await api
    .post('/api/blogs')
    .send(newPost)
    .expect(201)
    .expect('Content-Type', /application\/json/);    

  const allPost = await api.get('/api/blogs');
  expect(response.body.id).toBeDefined();
  expect(response.body.title).toBe(newPost.title);
  expect(response.body.likes).toBe(newPost.likes);
  expect(allPost.body.length).toBe(testBlogs.length+1);
})

test('if likes is missing it will default to 0', async () => {
  const newPost = 
  {
    title: "React hooks",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
  }
  const response = await api
    .post('/api/blogs')
    .send(newPost)
    .expect(201)
    .expect('Content-Type', /application\/json/);    

  expect(response.body.likes).toBe(0);
})

test('if url or title is missing, server return 400 - bad request', async () => {
  const newPostTitle = 
  {
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
  }
  const response = await api
    .post('/api/blogs')
    .send(newPostTitle);

  expect(response.status).toBe(400);

})

afterAll(async () => {
  await mongoose.connection.close()
})