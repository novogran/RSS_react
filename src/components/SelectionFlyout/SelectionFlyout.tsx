import { useDispatch, useSelector } from 'react-redux';
import { clearAllSelections } from '@/store/pokemonSelectionSlice';
import type { RootState } from '@/store/store';
import './SelectionFlyout.css';
import { handleDownloadCSV } from '@/utils/common';
import { useTranslations } from 'next-intl';

export const SelectionFlyout = () => {
  const dispatch = useDispatch();
  const t = useTranslations('SelectionFlyout');
  const selectedPokemons = useSelector(
    (state: RootState) => state.pokemonSelection.selectedPokemons
  );
  const selectedCount = selectedPokemons.length;

  if (selectedCount === 0) return null;

  return (
    <div className="selection-flyout">
      <div className="selection-info">
        {t('selectedCount', { count: selectedCount })}
      </div>
      <button
        className="flyout-button unselect-all"
        onClick={() => dispatch(clearAllSelections())}
        aria-label={t('unselectAllAriaLabel')}
      >
        {t('unselectAllText')}
      </button>
      <button
        className="flyout-button download"
        onClick={() => handleDownloadCSV(selectedPokemons, selectedCount)}
        aria-label={t('downloadAriaLabel')}
      >
        {t('downloadText')}
      </button>
    </div>
  );
};

export default SelectionFlyout;
