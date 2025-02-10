import React, { useState, useEffect } from 'react';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/blog-posts'); 
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      const data = await response.json();
      setBlogPosts(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts(); 
  }, []); 

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/api/blog-posts/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setBlogPosts(blogPosts.filter(post => post.id !== id));
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Blog</h2>
      {blogPosts.length === 0 ? (
        <p>No blog posts available</p>
      ) : (
        <ul>
          {blogPosts.map(post => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p><strong>Autor:</strong> {post.author}</p>
              <button onClick={() => handleDelete(post.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Blog;
