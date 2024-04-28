import React from 'react';
import { Link } from 'react-router-dom';
// import '../Post.css';

// Helper function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const Post = ({ post }) => {
    return (
        <div className="post">
            <div className="postDetails">
                <span>Posted on: {formatDate(post.created_at)} || by {post.username || 'Anonymous'} </span><br />
                <Link to={`/posts/${post.id}`} className="postTitle">
                    {post.title}
                </Link>
                <span className="upvotes">Upvotes: {post.upvotes} </span>
            </div>
        </div>
    );
}

export default Post;
