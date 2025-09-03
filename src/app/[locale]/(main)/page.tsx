import { PokemonSearch } from '@/components/PokemonSearch';
import { Header } from '@/components/Header';

export default async function HomePage() {
  return (
    <>
      <Header />
      <PokemonSearch />
    </>
  );
}
