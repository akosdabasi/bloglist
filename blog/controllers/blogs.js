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

blogsRouter.put('/:id', async (request, response) => 
{
  const body = request.body;
  
  const blog = await Blog.findByIdAndUpdate(request.params.id, {likes: body.likes}, {new: true});
   
  response.status(201).json(blog);
})

blogsRouter.delete('/:id', async (request, response) => 
{
  const blog = Blog.findByIdAndDelete(request.params.id);
  if(blog) response.status(204).send();
  else response.status(404).send(`document doesn't exist`);
})

module.exports = blogsRouter