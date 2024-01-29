const totalLikes = (blogs) => blogs.reduce((acc, curr) => acc + curr.likes, 0);

const favoriteBlog = (blogs) => 
{
  if(blogs.length === 0)
    return {};

  const {title, author, likes} = blogs.reduce((res, curr) => curr.likes > res.likes ? curr : res, blogs[0]);
  return {title, author, likes};
}

const findMaxValue = (map) => 
{
  let largestValue = 0;
  let largestKey;

  for (let [key, value] of map)
  {
    if (value > largestValue) 
    {
      largestValue = value;
      largestKey = key;
    }
  }

  return largestKey;
}

const mostBlogs = (blogs) =>
{
  if(blogs.length === 0)
    return {};

  let blogCount = new Map();
  blogs.forEach(blog => 
  {
    const author = blog.author;
    if(blogCount.has(author))
      blogCount.set(author, blogCount.get(author) + 1); 
    else 
      blogCount.set(author, 1);
  });

  const largestKey = findMaxValue(blogCount);

  return {author: largestKey, blogs: blogCount.get(largestKey)};
}

const mostLikes = (blogs) =>
{
  if(blogs.length === 0)
    return {};

  let likeCount = new Map();
  blogs.forEach(blog => 
  {
    const {author, likes} = blog;
    if(likeCount.has(author))
      likeCount.set(author, likeCount.get(author) + likes); 
    else 
      likeCount.set(author, likes);
  });

  const largestKey = findMaxValue(likeCount);

  return {author: largestKey, likes: likeCount.get(largestKey)};
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}