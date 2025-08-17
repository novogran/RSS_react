import React, { useState, useEffect } from 'react';
import './SearchBar.css';
import type { SearchBarProps } from './types/searchBar.types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { LOCAL_STORAGE_SEARCHTERM_KEY } from '@/constants';
import { useTranslations } from 'next-intl';

const SearchBar = ({ onSearchSubmit }: SearchBarProps) => {
  const [savedSearchTerm, setSearchTermToLS] = useLocalStorage(
    LOCAL_STORAGE_SEARCHTERM_KEY,
    ''
  );
  const [searchTerm, setSearchTerm] = useState('');
  const t = useTranslations('SearchBar');

  useEffect(() => {
    setSearchTerm(savedSearchTerm);
  }, [savedSearchTerm]);

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
          placeholder={t('searchPlaceholder')}
          className="search-input"
          aria-label={t('searchAriaLabel')}
        />
      </div>
      <button
        type="submit"
        className="search-button"
        aria-label={t('searchButtonAriaLabel')}
      >
        {t('searchButtonText')}
      </button>
    </form>
  );
};

export default SearchBar;
