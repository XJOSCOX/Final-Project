import React, { useEffect, useState } from 'react';
import Post from '../components/Post';
import { fetchPosts } from '../services/postsService';

const HomePage = ({ searchTerm }) => { // Accept searchTerm as a prop
    const [posts, setPosts] = useState([]);
    const [sort, setSort] = useState('created_at'); // Default sort
    const [ascending, setAscending] = useState(false);

    useEffect(() => {
        const loadPosts = async () => {
            // Include searchTerm in the fetchPosts function call
            const fetchedPosts = await fetchPosts(sort, ascending, searchTerm);
            setPosts(fetchedPosts);
        };
        loadPosts();
    }, [sort, ascending, searchTerm]); // Add searchTerm to the dependency array

    const handleSortChange = (e) => {
        setSort(e.target.value);
    };

    const handleSortDirectionChange = (e) => {
        setAscending(e.target.value === 'ascending');
    };

    return (
        <div className="centered-container">
          <div>
            <div className="sort-select">
              Order by:
              <div className="select-wrapper">
                <select className="custom-select" onChange={handleSortChange} value={sort}>
                  <option value="created_at">Time Created</option>
                  <option value="upvotes">Upvotes</option>
                </select>
              </div>
              <div className="select-wrapper">
                <select className="custom-select" onChange={handleSortDirectionChange}>
                  <option value="descending">Descending</option>
                  <option value="ascending">Ascending</option>
                </select>
              </div>
            </div><br />
            {posts.length > 0 ? (
              posts.map(post => <Post key={post.id} post={post} />)
            ) : (
              <p>No posts to display</p> // Show a message if no posts
            )}
          </div>
        </div>
      );
    };
    
    export default HomePage;
