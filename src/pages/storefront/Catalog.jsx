import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useCart } from '../../context/CartContext';
import { Plus } from 'lucide-react';

export function Catalog() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category');
    const { addToCart } = useCart();

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            let query = supabase.from('products').select('*');

            if (categoryFilter) {
                query = query.eq('category', categoryFilter);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching products:', error);
            } else {
                setProducts(data || []);
            }
            setLoading(false);
        }

        fetchProducts();
    }, [categoryFilter]);

    if (loading) {
        return (
            <div className="container py-20 text-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="h2 capitalize">{categoryFilter || 'All Products'}</h1>
                <span className="text-gray-500">{products.length} Items</span>
            </div>

            {products.length === 0 ? (
                <div className="py-20 text-center bg-gray-50 rounded-lg">
                    <p className="text-xl text-gray-500">No products found in this category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map(product => {
                        const displayImage = product.images?.[0] || 'https://via.placeholder.com/400x400';

                        return (
                            <div key={product.id} className="card group">
                                <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-100">
                                    <img
                                        src={displayImage}
                                        alt={product.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {product.compare_at_price && (
                                        <span className="absolute top-2 left-2 badge bg-red-500 text-white">Sale</span>
                                    )}
                                </Link>
                                <div className="p-4">
                                    <Link to={`/product/${product.id}`} className="block mb-2 hover:text-gray-600 transition-colors">
                                        <h3 className="font-semibold truncate">{product.title}</h3>
                                    </Link>
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-2 items-baseline">
                                            <span className="font-bold">${product.price}</span>
                                            {product.compare_at_price && (
                                                <span className="text-sm text-gray-400 line-through">${product.compare_at_price}</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="btn-icon bg-black text-white hover:bg-gray-800 p-2"
                                            title="Add to Cart"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
