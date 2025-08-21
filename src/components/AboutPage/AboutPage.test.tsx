import { render, screen } from '@testing-library/react';
import AboutPage from './AboutPage';
import { expect, test, vi, beforeAll } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'AboutPage.title': 'About the Developer',
      'AboutPage.developerName': 'Novogran Vitaly',
      'AboutPage.ageLabel': 'Age',
      'AboutPage.ageValue': '29',
      'AboutPage.locationLabel': 'Location',
      'AboutPage.locationValue': 'Minsk',
      'AboutPage.specialtyLabel': 'Specialty',
      'AboutPage.specialtyValue': 'Front-End Development',
      'AboutPage.journeyTitle': 'Development Journey',
      'AboutPage.journeyParagraph1': 'My programming journey began with Java',
      'AboutPage.journeyParagraph2': 'What I enjoy most about coding',
      'AboutPage.interestsTitle': 'Beyond Coding',
      'AboutPage.interestsIntro': 'When I am not coding',
      'AboutPage.interest1': 'Exploring new video game worlds',
      'AboutPage.interest2': 'Fixing and tinkering with tech gadgets',
      'AboutPage.interest3': 'Swimming for relaxation and fitness',
      'AboutPage.aspirationsTitle': 'Future Aspirations',
      'AboutPage.aspirationsText': 'passionate about continuous growth',
      'AboutPage.educationTitle': 'Education',
      'AboutPage.educationText': 'RS School education text',
      'AboutPage.rsSchoolLinkLabel': 'RS School React Course',
      'AboutPage.rsSchoolLinkText': 'RS School React Course',
      'AboutPage.developerStatsLabel': 'Developer Stats',
      'AboutPage.interestsListLabel': 'Hobbies and Interests',
    };
    return translations[key] || key;
  },
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({
    children,
    href,
    target,
    rel,
  }: {
    children: React.ReactNode;
    href: string;
    target?: string;
    rel?: string;
  }) => (
    <a href={href} target={target} rel={rel} data-testid="mocked-link">
      {children}
    </a>
  ),
}));

describe('AboutPage', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  test('корректно рендерится', () => {
    const { container } = render(<AboutPage />);
    expect(container).toBeInTheDocument();
  });

  test('отображает основной заголовок', () => {
    render(<AboutPage />);
    expect(screen.getByText('title')).toBeInTheDocument();
  });

  test('отображает информацию о разработчике', () => {
    render(<AboutPage />);

    expect(screen.getByText('developerName')).toBeInTheDocument();

    const statsList = screen.getByRole('list', { name: 'developerStatsLabel' });
    expect(statsList).toHaveTextContent('ageLabel: ageValue');
    expect(statsList).toHaveTextContent('locationLabel: locationValue');
    expect(statsList).toHaveTextContent('specialtyLabel: specialtyValue');
  });

  test('отображает раздел хобби', () => {
    render(<AboutPage />);

    expect(screen.getByText('interestsTitle')).toBeInTheDocument();

    expect(screen.getByText('interestsIntro')).toBeInTheDocument();

    const hobbiesList = screen.getByRole('list', {
      name: 'interestsListLabel',
    });

    expect(hobbiesList).toHaveTextContent('🎮 interest1');
    expect(hobbiesList).toHaveTextContent('🔧 interest2');
    expect(hobbiesList).toHaveTextContent('🏊 interest3');
  });

  test('отображает ссылку на школу', () => {
    render(<AboutPage />);
    const link = screen.getByTestId('mocked-link');
    expect(link).toHaveTextContent('rsSchoolLinkText');
    expect(link).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('отображает аватар', () => {
    render(<AboutPage />);
    expect(screen.getByTestId('avatar-placeholder')).toBeInTheDocument();
  });
});
