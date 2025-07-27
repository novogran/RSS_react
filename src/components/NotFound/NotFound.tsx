import React from 'react';
import './NotFound.css';

const NotFound: React.FC = () => (
  <div className="not-found">
    <div className="not-found-content">
      <div className="sad-pikachu">😢</div>
      <h1>404 - Page Not Found</h1>
      <p>The Pokémon you are looking for has fled!</p>
      <a href="/" className="home-link">
        Return to Pokémon Search
      </a>
    </div>
  </div>
);

export default NotFound;
