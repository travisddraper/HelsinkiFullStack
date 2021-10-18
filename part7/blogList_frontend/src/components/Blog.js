import React from 'react'
import { Link } from 'react-router-dom'

export const BlogTitle = ({ blog }) => {

  return (
    <div className="blogDiv">
      <p className="blog">
        <Link to={ {
          pathname: `blogs/${blog.id}`,
          state: {
            blog
          } }}>{blog.title} by {blog.author.name}</Link>
      </p>
    </div>

  )
}

const Blogs = ({ blogs }) => {

  return (
    <div>
      <h2>Blogs</h2>

      <div className="blogs">
        {blogs.sort((a, b) => b.likes - a.likes).map(blog => {
          return <BlogTitle
            key={blog.id}
            blog={blog}/>
        })}
      </div>
    </div>
  )
}

export default Blogs