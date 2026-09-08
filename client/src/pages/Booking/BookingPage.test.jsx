import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BookingPage from './BookingPage';

describe('BookingPage', () => {
  it('renders a booking form for the selected talent', () => {
    render(
      <MemoryRouter initialEntries={['/booking/john-doe']}>
        <Routes>
          <Route path="/booking/:slug" element={<BookingPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /book with john doe/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send booking request/i })).toBeInTheDocument();
  });
});
