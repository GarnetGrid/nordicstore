import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CartDrawer } from '../components/CartDrawer';

// Mock the CartContext
const mockSetIsCartOpen = vi.fn();
const mockRemoveFromCart = vi.fn();
const mockUpdateQuantity = vi.fn();

vi.mock('../context/CartContext', () => ({
    useCart: vi.fn(() => ({
        cart: [],
        isCartOpen: true,
        setIsCartOpen: mockSetIsCartOpen,
        removeFromCart: mockRemoveFromCart,
        updateQuantity: mockUpdateQuantity,
        cartTotal: 0
    }))
}));

import { useCart } from '../context/CartContext';

function renderDrawer() {
    return render(
        <MemoryRouter>
            <CartDrawer />
        </MemoryRouter>
    );
}

describe('CartDrawer', () => {
    it('shows empty message when cart is empty', () => {
        renderDrawer();
        expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
    });

    it('renders nothing when drawer is closed', () => {
        useCart.mockReturnValue({
            cart: [],
            isCartOpen: false,
            setIsCartOpen: mockSetIsCartOpen,
            removeFromCart: mockRemoveFromCart,
            updateQuantity: mockUpdateQuantity,
            cartTotal: 0
        });
        const { container } = render(
            <MemoryRouter><CartDrawer /></MemoryRouter>
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders cart items when present', () => {
        useCart.mockReturnValue({
            cart: [
                { id: 1, title: 'Test Shirt', price: 29.99, quantity: 2, images: ['shirt.jpg'] }
            ],
            isCartOpen: true,
            setIsCartOpen: mockSetIsCartOpen,
            removeFromCart: mockRemoveFromCart,
            updateQuantity: mockUpdateQuantity,
            cartTotal: 59.98
        });
        renderDrawer();
        expect(screen.getByText('Test Shirt')).toBeInTheDocument();
        expect(screen.getByText('$59.98')).toBeInTheDocument();
    });

    it('displays the Shopping Cart header', () => {
        useCart.mockReturnValue({
            cart: [],
            isCartOpen: true,
            setIsCartOpen: mockSetIsCartOpen,
            removeFromCart: mockRemoveFromCart,
            updateQuantity: mockUpdateQuantity,
            cartTotal: 0
        });
        renderDrawer();
        expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    });

    it('shows checkout link when items exist', () => {
        useCart.mockReturnValue({
            cart: [{ id: 1, title: 'Item', price: 10, quantity: 1, images: [] }],
            isCartOpen: true,
            setIsCartOpen: mockSetIsCartOpen,
            removeFromCart: mockRemoveFromCart,
            updateQuantity: mockUpdateQuantity,
            cartTotal: 10
        });
        renderDrawer();
        expect(screen.getByText('Checkout')).toBeInTheDocument();
    });
});
