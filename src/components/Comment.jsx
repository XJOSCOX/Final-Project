import React from 'react';
import { deleteComment } from '../services/commentsService'; // This should be an implemented function in your service file
// import '../Comment.css'; // Ensure the path is correct for your project structure

const Comment = ({ comment, onDelete }) => {
    // Function to delete the comment, requires the comment ID and a secret key
    const handleDelete = async () => {
        const secretKey = prompt("Please enter the secret key to delete this comment:");
        if (secretKey && secretKey.trim() !== "") {
            const result = await onDelete(comment.id, secretKey);
            if (result.success) {
                alert("Comment deleted successfully.");
                // If onDelete is handling state updates, you don't need to do anything here.
                // Otherwise, you might need to trigger a state update to remove the comment from the list.
            } else {
                alert("Failed to delete the comment. Wrong secret key.");
            }
        }
    };

    return (
        <div className="comment">
            <p>{comment.content}</p>
            <button onClick={handleDelete}>Delete Comment</button>
        </div>
    );
};

export default Comment;
