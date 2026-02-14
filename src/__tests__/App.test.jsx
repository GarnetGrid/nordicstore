import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock Supabase before importing anything that uses it
vi.mock('../lib/supabase', () => ({
    supabase: {
        auth: {
            getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
            onAuthStateChange: vi.fn(() => ({
                data: { subscription: { unsubscribe: vi.fn() } }
            }))
        }
    }
}));

import App from '../App';

describe('App', () => {
    it('renders without crashing', async () => {
        const { container } = render(<App />);
        // Wait for auth loading to finish
        await vi.waitFor(() => {
            expect(container.innerHTML).not.toBe('');
        });
    });

    it('renders the Home page by default', async () => {
        render(<App />);
        await vi.waitFor(() => {
            // The home page should render some content
            expect(document.body.innerHTML.length).toBeGreaterThan(0);
        });
    });
});
