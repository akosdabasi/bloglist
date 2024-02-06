const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

mongoose.set("bufferTimeoutMS", 10000);
const api = supertest(app);

/* Initializing tests*/

const testBlogs = 
[
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  }  
];

beforeEach(async ()=>
{
  await Blog.deleteMany({});
  await Blog.create(testBlogs);
});


describe('blogs GET api tests', ()=>
{

  test('blogs are returned as json', async () => 
  {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('there are 6 blogs', async () => 
  {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(testBlogs.length);
  });

  test('a specific blog is within the returned blogs', async () => 
  {
    const response = await api.get('/api/blogs');
    const blogTitles = response.body.map(blog => blog.title);
    expect(blogTitles).toContainEqual(testBlogs[0].title);
    expect(blogTitles).toContainEqual(testBlogs[4].title);
  })
});


describe('blogs POST API tests', ()=>
{
  test('new posts can be added', async () => 
  {
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
    
    const id = response.body.id;
    expect(response.body).toEqual({id, ...newPost});
    
    const allBlogs = await api.get('/api/blogs');
    expect(allBlogs.body).toHaveLength(testBlogs.length+1);
    expect(allBlogs.body).toContainEqual({id, ...newPost});
  })

  test('if likes is missing it will default to 0', async () => 
  {
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

  test('if url or title is missing, server return 400 - bad request', async () => 
  {
    const newPostTitle = 
    {
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
    }

    await api
      .post('/api/blogs')
      .send(newPostTitle)
      .expect(400);
  })
})

describe('blogs DELETE API tests', ()=>
{
  test('blog can be deleted', async () => 
  {
    let response = await api.get('/api/blogs').expect(200);
    const blogToDelete = response.body[2];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);
  
    response = await api.get('/api/blogs').expect(200);
    expect(response).not.toContainEqual(blogToDelete);
  
  })
})

describe('blogs PUT API tests', ()=>
{
  test('if likes field can be updated', async () => 
  {
    let response = await api.get('/api/blogs');
    const testBlog = response.body[1];
    const requestBody = 
    {
      likes: 50,
    }

    response = await api
      .put(`/api/blogs/${testBlog.id}`)
      .send(requestBody);
  
    expect(response.body.likes).toBe(50);
  })
})


afterAll(async () => {
  await mongoose.connection.close()
})