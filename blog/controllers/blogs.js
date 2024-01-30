const blogsRouter = require('express').Router();
const Blog = require('../models/blog');


blogsRouter.get('/', async (request, response) => 
{
  const blogs = await Blog.find({});
  response.json(blogs);
})

blogsRouter.post('/', async (request, response) => 
{
  const body = request.body;
  if(!body.title || !body.url)
   return response.status(400).end();

  const newBlog = await Blog.create({likes: 0, ...request.body}); 
  response.status(201).json(newBlog);
})

module.exports = blogsRouter