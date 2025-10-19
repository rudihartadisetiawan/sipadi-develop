import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import CustomLink from './CustomLink';

describe('CustomLink Component', () => {
  it('should render a link with the correct children', () => {
    render(
      <Router>
        <CustomLink href="/test">Click Me</CustomLink>
      </Router>
    );

    const linkElement = screen.getByRole('link', { name: /click me/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/test');
  });
});
