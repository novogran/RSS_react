import React, { useState } from 'react';
import './SearchBar.css';
import type { SearchBarProps } from './types/searchBar.types';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { LOCAL_STORAGE_SEARCHTERM_KEY } from '../../constants';

const SearchBar = ({ onSearchSubmit }: SearchBarProps) => {
  const [savedSearchTerm, setSearchTermToLS] = useLocalStorage(
    LOCAL_STORAGE_SEARCHTERM_KEY,
    ''
  );
  const [searchTerm, setSearchTerm] = useState(savedSearchTerm);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm === savedSearchTerm) return;
    setSearchTermToLS(searchTerm);
    onSearchSubmit(searchTerm);
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
