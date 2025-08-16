import { useDispatch, useSelector } from 'react-redux';
import { clearAllSelections } from '../../store/pokemonSelectionSlice';
import type { RootState } from '../../store/store';
import './SelectionFlyout.css';
import { handleDownloadCSV } from '../../utils/common';

export const SelectionFlyout = () => {
  const dispatch = useDispatch();
  const selectedPokemons = useSelector(
    (state: RootState) => state.pokemonSelection.selectedPokemons
  );
  const selectedCount = Object.keys(selectedPokemons).length;

  if (selectedCount === 0) return null;

  return (
    <div className="selection-flyout">
      <div className="selection-info">{selectedCount} Pokémon selected</div>
      <button
        className="flyout-button unselect-all"
        onClick={() => dispatch(clearAllSelections())}
      >
        Unselect all
      </button>
      <button
        className="flyout-button download"
        onClick={() => handleDownloadCSV(selectedPokemons, selectedCount)}
      >
        Download CSV
      </button>
    </div>
  );
};

export default SelectionFlyout;
