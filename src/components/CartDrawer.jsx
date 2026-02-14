import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export function CartDrawer() {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 transition-opacity"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white shadow-xl flex flex-col h-full transform transition-transform">
                <div className="p-4 flex items-center justify-between border-b">
                    <h2 className="text-lg font-bold">Shopping Cart</h2>
                    <button onClick={() => setIsCartOpen(false)} className="btn-icon">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p>Your cart is empty.</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="btn btn-outline mt-4"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex gap-4">
                                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                    <img src={item.images?.[0]} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium">{item.title}</h3>
                                    <p className="text-gray-500 text-sm">${item.price}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            className="p-1 hover:bg-gray-100 rounded"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="text-sm w-4 text-center">{item.quantity}</span>
                                        <button
                                            className="p-1 hover:bg-gray-100 rounded"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            <Plus size={14} />
                                        </button>
                                        <button
                                            className="ml-auto text-red-500 p-1 hover:bg-red-50 rounded"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="border-t p-4 space-y-4 bg-gray-50">
                        <div className="flex justify-between items-center font-bold text-lg">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <Link
                            to="/checkout"
                            className="btn btn-primary w-full text-center"
                            onClick={() => setIsCartOpen(false)}
                        >
                            Checkout
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
