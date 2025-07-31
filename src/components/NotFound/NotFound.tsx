import './NotFound.css';

const NotFound = () => (
  <div className="not-found" data-testid="not-found-container">
    <div className="not-found-content" data-testid="not-found-content">
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
