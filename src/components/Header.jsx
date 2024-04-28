import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import '../Header.css';

const Header = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value); // Propagate the search term to the parent component
    };

    return (
        <header className="header">
            <h1><Link to="/">HobbyHub</Link></h1>
            <input
                type="search"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="searchInput"
            />
            <nav>
                <ul>
                    {/* Navigation links can be added here */}
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/create">Create Post</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
