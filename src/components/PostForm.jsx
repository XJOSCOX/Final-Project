import React, { useState } from 'react';
// import '../PostForm.css'; // Ensure the path is correct depending on your project structure

const PostForm = ({ onSave, postDetails }) => {
    const [title, setTitle] = useState(postDetails ? postDetails.title : '');
    const [content, setContent] = useState(postDetails ? postDetails.content : '');
    const [imageUrl, setImageUrl] = useState(postDetails ? postDetails.imageUrl : '');
    const [username, setUsername] = useState(postDetails ? postDetails.username : '');
    const [secretKey, setSecretKey] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Attempting to save with:', { title, content, imageUrl, username, secretKey });
        onSave({
            title,
            content,
            imageUrl,
            username,
            secretKey  // Changed from secret_key to secretKey to maintain consistency
        });
    };

    return (
        <form className="post-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Content:</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Image URL:</label>
                <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Username (optional, leave blank to post anonymously):</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Secret Key (required for editing or deleting the post):</label>
                <input
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Save Post</button>
        </form>
    );
}

export default PostForm;
