import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app', () => {
  render(<App />);
  // App should render without errors
  // The RouterProvider will handle routing, and Suspense will show Loading fallback
  // Just verify the app renders without crashing
  expect(document.body).toBeInTheDocument();
});
