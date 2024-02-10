const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

mongoose.set("bufferTimeoutMS", 10000);
const api = supertest(app);

/* Initializing tests*/

const seedBlogs = 
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

const seedUsers = 
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

let testToken;
let testToken2;
let testBlogs;
let testUsers;
beforeAll(async ()=>
{
  await User.deleteMany({});
  const seedUsersHashed = await Promise.all(seedUsers.map(async user => {
    user.password = await bcrypt.hash(user.password, 10);
    return user;
  }));

  testUsers = await User.create(seedUsersHashed);
  
  let {username, password} = seedUsers[0];
  let response = await api.post('/login').send({username, password});
  testToken = response.body.accessToken;
  
  ({username, password} = seedUsers[0]);
  response = await api.post('/login').send({username, password});
  testToken2 = response.body.accessToken;
})
beforeEach(async ()=>
{ 

  await Blog.deleteMany({});
  testBlogs = await Blog.create(
    [
      {...seedBlogs[0], user: testUsers[0]._id },
      {...seedBlogs[1], user: testUsers[1]._id },
      {...seedBlogs[2], user: testUsers[2]._id },
      {...seedBlogs[3], user: testUsers[3]._id },
      {...seedBlogs[4], user: testUsers[0]._id },
      {...seedBlogs[5], user: testUsers[0]._id },
    ]
  );
  
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
      url: "https://reactpatterns.com/",
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${testToken}`)
      .send(newPost)
      .expect(201)
      .expect('Content-Type', /application\/json/);    
    
    expect(response.body.author).toEqual('Ákos Dabasi');
    
    const allBlogs = await api.get('/api/blogs');
    expect(allBlogs.body).toHaveLength(testBlogs.length+1);
    const titles = allBlogs.body.map(blog => blog.title);
    expect(titles).toContain(newPost.title);
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
      .set('Authorization', `Bearer ${testToken}`)
      .expect(400);
  })
})

describe('blogs DELETE API tests', ()=>
{
  test('blog can be deleted by owner', async () => 
  {
    const blogToDelete = testBlogs[0];
    await api
      .delete(`/api/blogs/${blogToDelete._id}`)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(204);
    
    const response = await api
      .get('/api/blogs')
      .expect(200);

    const titles = response.body.map(blog => blog.title);
    expect(titles).not.toContain(blogToDelete.title);
    expect(titles).toHaveLength(testBlogs.length - 1);
  })

  test('blog can not be deleted by someone other than the owner', async () => 
  {
    const blogToDelete = testBlogs[2];
    await api
      .delete(`/api/blogs/${blogToDelete._id}`)
      .set('Authorization', `Bearer ${testToken2}`)
      .expect(401);
    
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