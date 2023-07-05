import React from 'react';
import { render, screen } from '@testing-library/react';
import Table from './App';

test('renders learn react link', () => {
  render(<Table />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
