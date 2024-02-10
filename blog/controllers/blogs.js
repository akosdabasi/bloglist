const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => 
{
  const blogs = await Blog.find({}).populate('user', {username: 1});
  response.json(blogs);
})

blogsRouter.post('/', async (request, response) => 
{

  const user = request.user;
  const {title, url} = request.body;
  
  if(user === null)
    return response.status(401).json({error: "authentication failed"});

  if(!title || !url)
   return response.status(400).end();

  const blogToCreate = 
  {
    author: user.name,
    title,
    url,
    likes: 0,
    user: user._id
  }

  const newBlog = await Blog.create(blogToCreate);
  user.blogs = user.blogs.concat(newBlog._id);
  await user.save();
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
  const user = request.user;
  const blog = await Blog.findById(request.params.id);

  if(!blog)
    return response.status(404).send(`document doesn't exist`);

  if(blog.user.toString() !== user._id.toString())
    return response.status(401).send('not authorized');

  await blog.deleteOne();
  response.status(204).send('blog is deleted');
 
})

module.exports = blogsRouter