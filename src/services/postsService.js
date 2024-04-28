import { supabase } from './supabaseClient';

export const fetchPosts = async (sort = 'created_at', ascending = false, searchTerm = '') => {
    let query = supabase
        .from('posts')
        .select('*')
        .order(sort, { ascending });

    if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
    }

    let { data: posts, error } = await query;

    if (error) throw new Error(error.message);
    return posts;
};

export const fetchPostById = async (id) => {
    let { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw new Error(error.message);
    return post;
};

export const createPost = async (post) => {
    const { title, content, imageUrl, username, secretKey } = post;
    const newPost = {
        title,
        content,
        image_url: imageUrl,
        username,
        secret_key: secretKey
    };

    const { data, error } = await supabase
        .from('posts')
        .insert([newPost]);

    if (error) throw new Error(error.message);
    return data;
};

export const updatePost = async (id, updates, secretKey) => {
    // Fetch the current post to compare the secret key
    const { data: currentPost, error: fetchError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

    if (fetchError) {
        console.error('Error fetching post:', fetchError.message);
        return null;
    }

    if (currentPost.secret_key !== secretKey) {
        console.error('Secret key mismatch:', currentPost.secret_key, 'vs', secretKey);
        return null;
    }

    // Proceed with the update if the secret key matches
    const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select('*');  // Ensures that the updated data is returned


    if (error) {
        console.error('Update error:', error.message);
        return null; // Ensure this is correct based on how you handle errors
    }
    return data;
};

export const deletePost = async (id, secretKey) => {
    // Fetch the current post to compare the secret key
    const { data: currentPost, error: fetchError } = await supabase
        .from('posts')
        .select('secret_key')
        .eq('id', id)
        .single();

    if (fetchError) {
        console.error('Error fetching post:', fetchError.message);
        return { success: false, message: fetchError.message };
    }

    if (currentPost.secret_key !== secretKey) {
        return { success: false, message: "Invalid secret key." };
    }

    // First delete all comments associated with the post
    const { error: deleteCommentsError } = await supabase
        .from('comments')
        .delete()
        .eq('post_id', id);

    if (deleteCommentsError) {
        console.error('Error deleting comments:', deleteCommentsError.message);
        return { success: false, message: deleteCommentsError.message };
    }

    // Optionally delete upvotes here if they are stored in a separate table
    // Similar delete call as above for the upvotes table

    // Finally, delete the post itself
    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting post:', error.message);
        return { success: false, message: error.message };
    }
    return { success: true, message: "Post and all related data deleted successfully." };
};



export const upvotePost = async (id) => {
    try {
        // Explicitly cast the id to the expected type, for example, bigint
        const { data, error } = await supabase.rpc('increment_upvotes', { post_id: id.toString() });

        if (error) throw new Error(error.message);
        if (data && data.length > 0) {
            return { success: true, data: data[0] };
        } else {
            throw new Error('No data returned');
        }
    } catch (error) {
        console.error('Error upvoting post:', error.message);
        return { success: false, message: error.message };
    }
};

