import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import NotFoundPage from './pages/NotFoundPage';
import CreatePostPage from './pages/CreatePostPage';
import Header from './components/Header';
// import './PostPage.css'; // Assuming you saved the CSS rules in PostPage.css
import './App.css';


const App = () => {
  const [searchTerm, setSearchTerm] = useState(''); // State to keep track of the search term

  // Function to update the search term, which will be passed to the Header
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <Router>
      <Header onSearch={handleSearch} />
      <div style={{ paddingTop: '64px' }}> {/* Add padding to avoid content being hidden behind the fixed header */}
        <Routes>
          <Route path="/" element={<HomePage searchTerm={searchTerm} />} />
          <Route path="/posts/:postId" element={<PostPage />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
