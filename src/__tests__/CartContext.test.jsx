import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from '../context/CartContext';

// Helper component to expose cart context
function CartConsumer() {
    const { cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();
    return (
        <div>
            <span data-testid="count">{cartCount}</span>
            <span data-testid="total">{cartTotal.toFixed(2)}</span>
            <span data-testid="items">{JSON.stringify(cart)}</span>
            <button data-testid="add" onClick={() => addToCart({ id: 1, title: 'Shirt', price: 29.99 })}>Add</button>
            <button data-testid="add-qty" onClick={() => addToCart({ id: 2, title: 'Pants', price: 49.99 }, 3)}>Add 3</button>
            <button data-testid="remove" onClick={() => removeFromCart(1)}>Remove</button>
            <button data-testid="update" onClick={() => updateQuantity(1, 5)}>Update</button>
            <button data-testid="update-zero" onClick={() => updateQuantity(1, 0)}>Update Zero</button>
            <button data-testid="clear" onClick={() => clearCart()}>Clear</button>
        </div>
    );
}

describe('CartContext', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('starts with an empty cart', () => {
        render(<CartProvider><CartConsumer /></CartProvider>);
        expect(screen.getByTestId('count')).toHaveTextContent('0');
        expect(screen.getByTestId('total')).toHaveTextContent('0.00');
    });

    it('adds a product to the cart', async () => {
        const user = userEvent.setup();
        render(<CartProvider><CartConsumer /></CartProvider>);

        await user.click(screen.getByTestId('add'));
        expect(screen.getByTestId('count')).toHaveTextContent('1');
        expect(screen.getByTestId('total')).toHaveTextContent('29.99');
    });

    it('increments quantity when adding duplicate product', async () => {
        const user = userEvent.setup();
        render(<CartProvider><CartConsumer /></CartProvider>);

        await user.click(screen.getByTestId('add'));
        await user.click(screen.getByTestId('add'));
        expect(screen.getByTestId('count')).toHaveTextContent('2');
        expect(screen.getByTestId('total')).toHaveTextContent('59.98');
    });

    it('adds product with custom quantity', async () => {
        const user = userEvent.setup();
        render(<CartProvider><CartConsumer /></CartProvider>);

        await user.click(screen.getByTestId('add-qty'));
        expect(screen.getByTestId('count')).toHaveTextContent('3');
        expect(screen.getByTestId('total')).toHaveTextContent('149.97');
    });

    it('removes a product from the cart', async () => {
        const user = userEvent.setup();
        render(<CartProvider><CartConsumer /></CartProvider>);

        await user.click(screen.getByTestId('add'));
        await user.click(screen.getByTestId('remove'));
        expect(screen.getByTestId('count')).toHaveTextContent('0');
    });

    it('updates product quantity', async () => {
        const user = userEvent.setup();
        render(<CartProvider><CartConsumer /></CartProvider>);

        await user.click(screen.getByTestId('add'));
        await user.click(screen.getByTestId('update'));
        expect(screen.getByTestId('count')).toHaveTextContent('5');
        expect(screen.getByTestId('total')).toHaveTextContent('149.95');
    });

    it('removes product when quantity set to 0', async () => {
        const user = userEvent.setup();
        render(<CartProvider><CartConsumer /></CartProvider>);

        await user.click(screen.getByTestId('add'));
        await user.click(screen.getByTestId('update-zero'));
        expect(screen.getByTestId('count')).toHaveTextContent('0');
    });

    it('clears the entire cart', async () => {
        const user = userEvent.setup();
        render(<CartProvider><CartConsumer /></CartProvider>);

        await user.click(screen.getByTestId('add'));
        await user.click(screen.getByTestId('add-qty'));
        await user.click(screen.getByTestId('clear'));
        expect(screen.getByTestId('count')).toHaveTextContent('0');
        expect(screen.getByTestId('total')).toHaveTextContent('0.00');
    });

    it('persists cart to localStorage', async () => {
        const user = userEvent.setup();
        render(<CartProvider><CartConsumer /></CartProvider>);

        await user.click(screen.getByTestId('add'));
        const saved = JSON.parse(localStorage.getItem('shopify-cart'));
        expect(saved).toHaveLength(1);
        expect(saved[0].title).toBe('Shirt');
    });

    it('restores cart from localStorage', () => {
        localStorage.setItem('shopify-cart', JSON.stringify([
            { id: 99, title: 'Hat', price: 19.99, quantity: 2 }
        ]));
        render(<CartProvider><CartConsumer /></CartProvider>);
        expect(screen.getByTestId('count')).toHaveTextContent('2');
        expect(screen.getByTestId('total')).toHaveTextContent('39.98');
    });

    it('calculates total with multiple products', async () => {
        const user = userEvent.setup();
        render(<CartProvider><CartConsumer /></CartProvider>);

        await user.click(screen.getByTestId('add'));       // 1 × $29.99
        await user.click(screen.getByTestId('add-qty'));   // 3 × $49.99
        expect(screen.getByTestId('total')).toHaveTextContent('179.96');
    });
});
