import { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { LayoutDashboard, Package, ShoppingCart, LogOut } from 'lucide-react';

export function AdminLayout() {
    const { user, signOut, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    if (loading) return <div className="p-8 text-center">Loading Admin...</div>;

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold tracking-tight">Admin Portal</h2>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link to="/admin/products" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                        <Package size={20} />
                        Products
                    </Link>
                    <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                        <ShoppingCart size={20} />
                        Orders
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={() => signOut()}
                        className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    );
}

export function Dashboard() {
    const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

    useEffect(() => {
        async function fetchStats() {
            // Parallel requests for speed
            const [products, orders] = await Promise.all([
                supabase.from('products').select('*', { count: 'exact', head: true }),
                supabase.from('orders').select('total_price')
            ]);

            const revenue = orders.data?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;

            setStats({
                products: products.count || 0,
                orders: orders.data?.length || 0,
                revenue
            });
        }
        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="h2 mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-medium mb-2">Total Revenue</h3>
                    <p className="text-3xl font-bold">${stats.revenue.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-medium mb-2">Total Orders</h3>
                    <p className="text-3xl font-bold">{stats.orders}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-medium mb-2">Active Products</h3>
                    <p className="text-3xl font-bold">{stats.products}</p>
                </div>
            </div>
        </div>
    );
}
