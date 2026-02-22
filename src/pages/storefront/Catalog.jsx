import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useCart } from '../../context/CartContext';
import { Plus } from 'lucide-react';

const MOCK_PRODUCTS = [
    { id: 1, title: 'Merino Wool Crewneck', price: 89, category: 'apparel', images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80'] },
    { id: 2, title: 'Linen Blend Trousers', price: 120, category: 'apparel', images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'] },
    { id: 3, title: 'Canvas Weekender Bag', price: 195, category: 'accessories', images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'] },
    { id: 4, title: 'Minimal Leather Watch', price: 250, category: 'accessories', images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80'] },
    { id: 5, title: 'Suede Chelsea Boots', price: 280, category: 'footwear', images: ['https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80'] },
    { id: 6, title: 'White Leather Sneakers', price: 165, category: 'footwear', images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80'] },
    { id: 7, title: 'Cashmere Scarf', price: 135, category: 'accessories', images: ['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80'] },
    { id: 8, title: 'Oversized Cotton Tee', price: 55, category: 'apparel', compare_at_price: 75, images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'] },
];

export function Catalog() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category');
    const { addToCart } = useCart();

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                let query = supabase.from('products').select('*');
                if (categoryFilter) {
                    query = query.eq('category', categoryFilter);
                }
                const { data, error } = await query;
                if (error || !data || data.length === 0) {
                    // Fall back to mock data
                    const filtered = categoryFilter
                        ? MOCK_PRODUCTS.filter(p => p.category === categoryFilter)
                        : MOCK_PRODUCTS;
                    setProducts(filtered);
                } else {
                    setProducts(data);
                }
            } catch {
                // Supabase not configured — use mock data
                const filtered = categoryFilter
                    ? MOCK_PRODUCTS.filter(p => p.category === categoryFilter)
                    : MOCK_PRODUCTS;
                setProducts(filtered);
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
