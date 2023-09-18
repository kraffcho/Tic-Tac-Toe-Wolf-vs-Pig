import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/:/i); // : can be replaced with any text that is expected to be in the app
  expect(linkElement).toBeInTheDocument();
});
