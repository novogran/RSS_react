import React from 'react';
import './SearchBar.css';
import type { SearchBarProps } from '../../types/searchBar.types';

class SearchBar extends React.Component<SearchBarProps> {
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onSearchChange(e.target.value);
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.onSearchSubmit();
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={this.props.searchTerm}
            onChange={this.handleChange}
            placeholder="Search Pokémon by name..."
            className="search-input"
          />
        </div>
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    );
  }
}

export default SearchBar;
