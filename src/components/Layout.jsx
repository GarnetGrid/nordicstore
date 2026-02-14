import { Link, Outlet, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CartDrawer } from './CartDrawer';

export function Layout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cartCount, setIsCartOpen } = useCart();
    const { user, signOut } = useAuth();
    const location = useLocation();

    const isAdmin = location.pathname.startsWith('/admin');

    if (isAdmin && !user) {
        // Ideally redirect to login here, but handled in protected route
    }

    return (
        <div className="flex flex-col min-h-screen">
            <header className="header">
                <div className="container flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="text-xl font-bold tracking-tight">
                        NORDIC<span className="text-gray-400">STORE</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-lg">
                        {!isAdmin ? (
                            <>
                                <Link to="/" className="nav-link">Home</Link>
                                <Link to="/catalog" className="nav-link">Catalog</Link>
                                <Link to="/about" className="nav-link">About</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/admin" className="nav-link">Dashboard</Link>
                                <Link to="/admin/products" className="nav-link">Products</Link>
                                <Link to="/admin/orders" className="nav-link">Orders</Link>
                            </>
                        )}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-md">
                        {user ? (
                            <div className="hidden md:flex items-center gap-sm">
                                <span className="text-sm font-medium">{user.email}</span>
                                <button onClick={signOut} className="text-sm text-red-500 hover:text-red-700">Logout</button>
                            </div>
                        ) : (
                            <Link to="/login" className="hidden md:block btn-icon">
                                <User size={20} />
                            </Link>
                        )}

                        {!isAdmin && (
                            <button
                                className="btn-icon relative"
                                onClick={() => setIsCartOpen(true)}
                            >
                                <ShoppingBag size={20} />
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden btn-icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-100 py-4 absolute w-full bg-white shadow-lg">
                        <nav className="container flex flex-col gap-md">
                            <Link to="/" className="text-lg" onClick={() => setIsMenuOpen(false)}>Home</Link>
                            <Link to="/catalog" className="text-lg" onClick={() => setIsMenuOpen(false)}>Catalog</Link>
                            <hr />
                            {user ? (
                                <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="text-left text-red-500">Logout</button>
                            ) : (
                                <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                            )}
                        </nav>
                    </div>
                )}
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="bg-gray-100 py-12 border-t border-gray-200 mt-auto">
                <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h4 className="font-bold mb-4">NORDICSTORE</h4>
                        <p className="text-sm text-gray-600">Premium minimalism for the modern lifestyle.</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Shop</h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li><Link to="/catalog?category=apparel">Apparel</Link></li>
                            <li><Link to="/catalog?category=footwear">Footwear</Link></li>
                            <li><Link to="/catalog?category=accessories">Accessories</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Support</h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/shipping">Shipping</Link></li>
                            <li><Link to="/returns">Returns</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="container mt-8 pt-8 border-t border-gray-200 text-center text-xs text-gray-500">
                    © {new Date().getFullYear()} NordicStore. All rights reserved.
                </div>
            </footer>

            <CartDrawer />
        </div>
    );
}
