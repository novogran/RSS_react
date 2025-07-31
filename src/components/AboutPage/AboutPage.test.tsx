import { render, screen } from '@testing-library/react';
import AboutPage from './AboutPage';
import '@testing-library/jest-dom';

describe('AboutPage', () => {
  beforeEach(() => {
    render(<AboutPage />);
  });

  it('отображение основного заголовка', () => {
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'About the Developer'
    );
  });

  it('отображает информацию о разработчике', () => {
    expect(screen.getByText('Novogran Vitaly')).toBeInTheDocument();

    const stats = screen.getByRole('list', { name: 'Developer Stats' });
    expect(stats).toBeInTheDocument();
    expect(stats).toHaveTextContent('Age: 29');
    expect(stats).toHaveTextContent('Location: Minsk');
    expect(stats).toHaveTextContent('Specialty: Front-End Development');
  });

  it('показывает раздел о пути развития', () => {
    expect(
      screen.getByRole('heading', { name: 'Development Journey' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/My programming journey began with Java/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/What I enjoy most about coding/)
    ).toBeInTheDocument();
  });

  it('отображает раздел хобби', () => {
    expect(
      screen.getByRole('heading', { name: 'Beyond Coding' })
    ).toBeInTheDocument();
    expect(screen.getByText(/When I am not coding/)).toBeInTheDocument();

    const lists = screen.getAllByRole('list');
    const hobbiesList = lists.find(
      (list) =>
        list.textContent?.includes('🎮 Exploring new video game worlds') &&
        list.textContent?.includes('🏊 Swimming for relaxation and fitness')
    );

    expect(hobbiesList).toBeInTheDocument();
    expect(hobbiesList).toHaveTextContent('🎮 Exploring new video game worlds');
    expect(hobbiesList).toHaveTextContent(
      '🔧 Fixing and tinkering with tech gadgets'
    );
    expect(hobbiesList).toHaveTextContent(
      '🏊 Swimming for relaxation and fitness'
    );
  });

  it('показывает будущие устремления', () => {
    expect(
      screen.getByRole('heading', { name: 'Future Aspirations' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/passionate about continuous growth/)
    ).toBeInTheDocument();
  });

  it('отображает ссылку на школу', () => {
    expect(
      screen.getByRole('heading', { name: 'Education' })
    ).toBeInTheDocument();
    const rsLink = screen.getByRole('link', { name: 'RS School React Course' });
    expect(rsLink).toBeInTheDocument();
    expect(rsLink).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    expect(rsLink).toHaveAttribute('target', '_blank');
    expect(rsLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('наличие аватара', () => {
    expect(screen.getByTestId('avatar-placeholder')).toBeInTheDocument();
  });

  it('соответствие всем заголовкам разделов', () => {
    const headings = screen.getAllByRole('heading');
    expect(headings).toHaveLength(6);
    expect(headings[0]).toHaveTextContent('About the Developer');
    expect(headings[1]).toHaveTextContent('Novogran Vitaly');
    expect(headings[2]).toHaveTextContent('Development Journey');
    expect(headings[3]).toHaveTextContent('Beyond Coding');
    expect(headings[4]).toHaveTextContent('Future Aspirations');
    expect(headings[5]).toHaveTextContent('Education');
  });
});
