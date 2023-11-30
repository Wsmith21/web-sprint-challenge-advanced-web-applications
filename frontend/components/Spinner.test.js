import React from 'react';
import { render } from '@testing-library/react';
import Spinner from './Spinner'; // Replace './Spinner' with the correct path to your Spinner component

test('renders a default spinner', () => {
  const { container } = render(<Spinner />);
  // Add assertions to test the default rendering of the spinner
  expect(container).toMatchSnapshot(); // Use snapshot testing or other specific assertions
});