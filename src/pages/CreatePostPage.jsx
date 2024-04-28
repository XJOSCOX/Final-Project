import React from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { createPost } from '../services/postsService';

const CreatePostPage = () => {
    const navigate = useNavigate(); // Hook for navigation

    const handleSave = async (postData) => {
        try {
            // Ensure postData includes: title, content, imageUrl, username, and secretKey
            const savedPost = await createPost({
                title: postData.title,
                content: postData.content,
                imageUrl: postData.imageUrl,
                username: postData.username, // Assuming the PostForm provides this
                secretKey: postData.secretKey // Assuming the PostForm provides this
            });
            console.log('Post saved successfully:', savedPost);
            navigate('/'); // Redirect to the home page after successful save
        } catch (error) {
            console.error('Failed to save post:', error);
            // Optionally, handle errors, e.g., show an error message to the user
        }
    };

    return <PostForm onSave={handleSave} />;
}

export default CreatePostPage;
