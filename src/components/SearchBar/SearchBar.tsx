import React from 'react';
import './SearchBar.css';
import type { SearchBarProps } from '../../types/searchBar.types';

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('pokemonSearchTerm', searchTerm);
    onSearchSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-input-container">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search Pokémon by name..."
          className="search-input"
        />
      </div>
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
