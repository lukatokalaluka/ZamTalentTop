import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BookingPage from './BookingPage';
vi.mock('../../services/api', () => ({
  getProfile: vi.fn().mockResolvedValue({
    profile: {
      id: 'profile-1',
      user_id: 'seller-1',
      slug: 'john-doe',
      name: 'John Doe',
      title: 'Photographer',
      location: 'Lusaka',
      services: [{ name: 'Photography', price: 'K3,500' }],
    },
  }),
  createBooking: vi.fn(),
}));

describe('BookingPage', () => {
  it('renders a booking form for the selected talent', async () => {
    render(
      <MemoryRouter initialEntries={['/booking/john-doe']}>
        <Routes>
          <Route path="/booking/:slug" element={<BookingPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByRole('heading', { name: /book with john doe/i })).toBeInTheDocument());
    expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send booking request/i })).toBeInTheDocument();
  });
});
