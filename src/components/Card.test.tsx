import { render, screen } from '@testing-library/react';
import ResultsList from './ResultsList';

it('отображает данные покемона', () => {
  render(
    <ResultsList
      loading={false}
      results={[
        {
          id: 3,
          name: 'Charizard',
          types: ['electric'],
          abilities: ['static', 'lightning-rod'],
        },
      ]}
      error={null}
    />
  );

  expect(screen.getByText('#003')).toBeInTheDocument();
  expect(screen.getByText('Charizard')).toBeInTheDocument();
});
