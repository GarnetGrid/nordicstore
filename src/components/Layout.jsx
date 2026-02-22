import { Link, Outlet, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CartDrawer } from './CartDrawer';

export function Layout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cartCount, setIsCartOpen } = useCart();
    const { user, signOut } = useAuth();
    const location = useLocation();

    const isAdmin = location.pathname.startsWith('/admin');

    // Anti-copy protection
    useEffect(() => {
        const noCtx = (e) => e.preventDefault();
        const noDrag = (e) => e.preventDefault();
        const noKeys = (e) => {
            const k = e.key, cm = e.ctrlKey || e.metaKey;
            if ((cm && (k === 'u' || k === 's' || k === 'a' || k === 'c')) ||
                (cm && e.shiftKey && (k === 'I' || k === 'J' || k === 'C')) ||
                k === 'F12') {
                e.preventDefault();
            }
        };
        document.documentElement.style.userSelect = 'none';
        document.documentElement.style.webkitUserSelect = 'none';
        document.addEventListener('contextmenu', noCtx);
        document.addEventListener('dragstart', noDrag);
        document.addEventListener('keydown', noKeys);
        console.log('%c⚠️ This site is protected by GarnetGrid.', 'color:#e63946;font-size:14px;font-weight:bold;');
        return () => {
            document.removeEventListener('contextmenu', noCtx);
            document.removeEventListener('dragstart', noDrag);
            document.removeEventListener('keydown', noKeys);
        };
    }, []);

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
                    <div>© {new Date().getFullYear()} NordicStore. All rights reserved.</div>
                    <a href="https://garnetgrid.com" target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.75rem', fontFamily: 'monospace', fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#999', textDecoration: 'none', opacity: 0.5, transition: 'opacity 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = '#e63946'; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.color = '#999'; }}
                        title="Built by GarnetGrid"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" style={{ width: '14px', height: '14px', minWidth: '14px', display: 'block' }}>
                            <defs>
                                <linearGradient id="gf1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#9b1b30" /><stop offset="100%" stopColor="#d4374a" /></linearGradient>
                                <linearGradient id="gf2" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#e63946" /><stop offset="100%" stopColor="#7a1525" /></linearGradient>
                                <linearGradient id="gf3" x1="50%" y1="0%" x2="50%" y2="100%"><stop offset="0%" stopColor="#ff6b6b" /><stop offset="100%" stopColor="#c0392b" /></linearGradient>
                            </defs>
                            <style>{`@keyframes facet-shimmer{0%,100%{opacity:0}15%{opacity:.9}30%{opacity:0}}@keyframes gem-rotate{0%,100%{transform:rotate(0) scale(1)}25%{transform:rotate(3deg) scale(1.02)}75%{transform:rotate(-3deg) scale(1.02)}}@keyframes sparkle-pop{0%,100%{opacity:0;transform:scale(0)}50%{opacity:1;transform:scale(1)}}.gem-body{transform-origin:12px 12px;animation:gem-rotate 4s ease-in-out infinite}.shimmer-1{animation:facet-shimmer 3s ease-in-out infinite}.shimmer-2{animation:facet-shimmer 3s ease-in-out infinite;animation-delay:1s}.sparkle{transform-origin:center;animation:sparkle-pop 2.5s ease-in-out infinite}.sparkle:nth-child(2){animation-delay:.8s}.sparkle:nth-child(3){animation-delay:1.6s}`}</style>
                            <g className="gem-body">
                                <polygon points="12,22 4,10 20,10" fill="url(#gf1)" />
                                <polygon points="4,10 8,3 12,6 12,10" fill="url(#gf2)" />
                                <polygon points="20,10 16,3 12,6 12,10" fill="url(#gf3)" />
                                <polygon points="8,3 12,1.5 16,3 12,6" fill="#e63946" />
                                <polygon points="4,10 12,10 12,22" fill="url(#gf2)" opacity=".7" />
                                <polygon points="20,10 12,10 12,22" fill="url(#gf1)" opacity=".8" />
                                <polygon className="shimmer-1" points="4,10 12,10 12,22" fill="white" opacity="0" />
                                <polygon className="shimmer-2" points="20,10 12,10 12,22" fill="white" opacity="0" />
                            </g>
                            <g>
                                <circle className="sparkle" cx="3" cy="5" r=".8" fill="white" opacity="0" />
                                <circle className="sparkle" cx="21" cy="4" r=".6" fill="white" opacity="0" />
                                <circle className="sparkle" cx="22" cy="16" r=".7" fill="white" opacity="0" />
                            </g>
                        </svg>
                        GarnetGrid
                    </a>
                </div>
            </footer>

            <CartDrawer />
        </div>
    );
}
