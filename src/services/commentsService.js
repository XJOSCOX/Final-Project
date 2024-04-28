import { supabase } from './supabaseClient';

// Fetch all comments for a post
export const fetchComments = async (postId) => {
    let { data: comments, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return comments;
};

export const addComment = async (postId, content, username, secretKey) => {
    const { data, error } = await supabase
        .from('comments')
        .insert([
            { post_id: postId, content: content, username: username, secret_key: secretKey }
        ])
        .select('*');  // This line ensures that the inserted data is returned

    if (error) {
        console.error("Error adding comment:", error.message);
        throw new Error(error.message);
    }
    return data;
};


// Delete a comment by ID and secret key
export const deleteComment = async (commentId, secretKey) => {
    // Fetch the comment first to check the secret key
    let { data: comment, error: fetchError } = await supabase
        .from('comments')
        .select('secret_key')
        .eq('id', commentId)
        .single();

    if (fetchError) {
        console.error('Error fetching comment:', fetchError.message);
        return { success: false, error: fetchError.message };
    }

    // If the secret keys match, delete the comment
    if (comment.secret_key === secretKey) {
        let { error: deleteError } = await supabase
            .from('comments')
            .delete()
            .match({ id: commentId });

        if (deleteError) {
            console.error('Error deleting comment:', deleteError.message);
            return { success: false, error: deleteError.message };
        }
        return { success: true };
    } else {
        return { success: false, error: 'Invalid secret key.' };
    }
};
