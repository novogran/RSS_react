import { useDispatch, useSelector } from 'react-redux';
import { clearAllSelections } from '../../utils/pokemonSelectionSlice';
import type { RootState } from '../../utils/store';
import './SelectionFlyout.css';

export const SelectionFlyout = () => {
  const dispatch = useDispatch();
  const selectedPokemons = useSelector(
    (state: RootState) => state.pokemonSelection.selectedPokemons
  );
  const selectedCount = Object.keys(selectedPokemons).length;

  const handleDownload = () => {
    const csvContent = [
      'ID,Name,Types,Abilities,URL',
      ...Object.values(selectedPokemons).map(
        (p) =>
          `${p.id},${p.name},${p.types.join('|')},${p.abilities.join('|')},${p.url}`
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedCount}_pokemons.csv`;
    link.click();
  };

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
      <button className="flyout-button download" onClick={handleDownload}>
        Download CSV
      </button>
    </div>
  );
};

export default SelectionFlyout;
