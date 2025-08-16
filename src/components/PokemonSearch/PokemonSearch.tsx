import { SearchBar } from '../SearchBar';
import { ResultsList } from '../ResultsList';
import { Pagination } from '../Pagination';
import { PokemonDetails } from '../PokemonDetails';
import { ITEMS_PER_PAGE } from '../../constants';
import { usePokemonSearch } from '../../hooks/usePokemonSearch';
import { SelectionFlyout } from '../SelectionFlyout';
import './PokemonSearch.css';

export const PokemonSearch = () => {
  const {
    state,
    selectedPokemon,
    detailsLoading,
    handleSearch,
    handlePageChange,
    handlePokemonSelect,
    handleCloseDetails,
    handleRefresh,
  } = usePokemonSearch();

  return (
    <div className="content-wrapper">
      <div className="pokemon-search-container">
        <div className="search-section">
          <SearchBar onSearchSubmit={handleSearch} />
        </div>

        <div className="results-section">
          <div className="master-detail-container">
            <div className="master-list">
              {!state.listLoading &&
                !state.error &&
                state.results.length > 0 &&
                state.totalCount > 1 && (
                  <Pagination
                    currentPage={state.currentPage}
                    totalPages={Math.ceil(state.totalCount / ITEMS_PER_PAGE)}
                    onPageChange={handlePageChange}
                  />
                )}
              <ResultsList
                results={state.results}
                loading={state.listLoading}
                error={state.error}
                onPokemonSelect={handlePokemonSelect}
                selectedPokemonId={selectedPokemon?.id}
              />
              {!state.error && (
                <button
                  className="force-api-call-button"
                  onClick={handleRefresh}
                >
                  RefreshData
                </button>
              )}
            </div>

            {selectedPokemon && (
              <div className="detail-view">
                <PokemonDetails
                  pokemon={selectedPokemon}
                  loading={detailsLoading}
                  onClose={handleCloseDetails}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <SelectionFlyout />
    </div>
  );
};

export default PokemonSearch;
