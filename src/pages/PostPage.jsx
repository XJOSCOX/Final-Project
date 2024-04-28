import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostById, upvotePost, deletePost, updatePost } from '../services/postsService';
import { fetchComments, addComment, deleteComment } from '../services/commentsService';
import Comment from '../components/Comment';

const PostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');

  useEffect(() => {
    const loadPostAndComments = async () => {
        const fetchedPost = await fetchPostById(postId);
        if (fetchedPost) {
            setPost(fetchedPost);
            setTitle(fetchedPost.title);
            setContent(fetchedPost.content);
            setImageUrl(fetchedPost.image_url || '');
        } else {
            // Handle error or data fetching issues
            alert('Failed to load post details.');
        }
        const fetchedComments = await fetchComments(postId);
        setComments(fetchedComments);
    };
    loadPostAndComments();
}, [postId]);


const handleUpvote = async () => {
  try {
      const result = await upvotePost(postId);
      if (result.success) {
          setPost(prevState => ({
              ...prevState,
              upvotes: result.data.upvotes // Ensure this matches the expected output structure
          }));
          alert('Post upvoted successfully!');
      } else {
          alert(`Failed to upvote the post: ${result.message}`);
      }
  } catch (error) {
      console.error('Error upvoting post:', error);
      alert('Failed to upvote the post due to an unexpected error.');
  }
};



const [commentUsername, setCommentUsername] = useState('');
  const [commentSecretKey, setCommentSecretKey] = useState('');

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        const newCommentObj = await addComment(postId, newComment);
        if (newCommentObj && newCommentObj.length > 0) {
          setComments(prevComments => [...prevComments, newCommentObj[0]]);  // Assuming the API returns an array
          setNewComment('');
        } else {
          throw new Error("No comment was returned after addition.");
        }
      } catch (error) {
        console.error('Failed to add comment:', error);
        alert('Failed to add comment.');
      }
    }
  };

  const handleDeletePost = async () => {
    const key = prompt('Enter the secret key to delete this post:');
    if (!key) {
        alert('Secret key is required!');
        return;
    }

    const result = await deletePost(postId, key);
    if (result.success) {
        alert('Post deleted successfully.');
        // Redirect or refresh the page as needed
        navigate('/');
    } else {
        alert(`Failed to delete the post: ${result.message}`);
    }
};


  const handleDeleteComment = async (commentId) => {
    const key = prompt('Enter the secret key to delete this comment:');
    if (key) {
      const result = await deleteComment(commentId, key);
      if (result) {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
      } else {
        alert('Failed to delete the comment. Wrong secret key.');
      }
    }
  };

  const handleSaveChanges = async () => {
    const updates = { title, content, image_url: imageUrl };  // Ensure field names are correct
    console.log('Attempting to update with:', { title, content, imageUrl, secretKey });

    const updatedPost = await updatePost(postId, updates, secretKey);
    console.log('Updated post response:', updatedPost);

    if (updatedPost && updatedPost.length > 0) {
      console.log('Update successful:', updatedPost);
      setPost(updatedPost[0]);  // Assuming the API returns an array of updated posts
      setEditMode(false);
      alert('Post updated successfully.');
    } else {
      console.log('Update failed or no data returned:', updatedPost);
      // Optionally, return the original post as fallback
      setPost((prev) => ({ ...prev }));
      alert('Failed to update the post.');
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="centered-container">
      <h1>{editMode }</h1>
      {editMode ? (
        <div className="input-group">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Post Title" />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required placeholder="Post Content" />
          <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL" />
          <input type="password" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} placeholder="Secret Key" required />
          <button onClick={handleSaveChanges}>Save Changes</button>
          <button onClick={() => setEditMode(false)} className="cancel-btn">Cancel</button>
        </div>
      ) : (
        <div className="content-box">
          <div className="title-section">
            <h2>{post.title}</h2>
          </div>
          <hr />
          <div className="content-section">
            <p>{post.content}</p>
            {post.image_url && <img src={post.image_url} alt={post.title} className="post-image" />}
          </div>
          <div className="input-group">
          <p>Upvotes: {post.upvotes}</p><br />
            <button onClick={() => setEditMode(true)}>Edit Post</button>
            <button onClick={handleDeletePost}>Delete Post</button>
            <button onClick={handleUpvote}>Upvote</button>
          </div>
        </div>
      )}
      <div className="comments-section">
        <h3>Comments:</h3>
        <div className="add-comment-section">
          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              required
            />
            <input
              type="text"
              value={commentUsername}
              onChange={(e) => setCommentUsername(e.target.value)}
              placeholder="Username (required)"
              required
            />
            <input
              type="password"
              value={commentSecretKey}
              onChange={(e) => setCommentSecretKey(e.target.value)}
              placeholder="Secret Key (required)"
              required
            />
            <button type="submit">Add Comment</button>
          </form>
        </div>
        <div className="existing-comments">
          {comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostPage;