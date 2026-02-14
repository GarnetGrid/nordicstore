import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useCart } from '../../context/CartContext';
import { Minus, Plus, ShoppingBag } from 'lucide-react';

export function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    useEffect(() => {
        async function fetchProduct() {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching product:', error);
            } else {
                setProduct(data);
            }
            setLoading(false);
        }
        fetchProduct();
    }, [id]);

    if (loading) return <div className="container py-20 text-center">Loading product...</div>;
    if (!product) return <div className="container py-20 text-center">Product not found.</div>;

    const displayImage = product.images?.[0] || 'https://via.placeholder.com/600x600';

    return (
        <div className="container py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Product Image */}
                <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square">
                    <img
                        src={displayImage}
                        alt={product.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Product Info */}
                <div className="flex flex-col justify-center space-y-8">
                    <div>
                        <span className="text-sm text-gray-500 uppercase tracking-wider">{product.category}</span>
                        <h1 className="h1 mt-2 mb-4">{product.title}</h1>
                        <div className="flex items-baseline gap-4 text-2xl">
                            <span className="font-bold">${product.price}</span>
                            {product.compare_at_price && (
                                <span className="text-gray-400 line-through text-lg">${product.compare_at_price}</span>
                            )}
                        </div>
                    </div>

                    <div className="prose text-gray-600">
                        <p>{product.description || 'No description available for this product.'}</p>
                    </div>

                    <div className="border-t border-gray-100 pt-8 space-y-4">
                        <div className="flex items-center gap-4">
                            <label className="font-medium">Quantity</label>
                            <div className="flex items-center border border-gray-200 rounded-md">
                                <button
                                    className="p-3 hover:bg-gray-50"
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="w-12 text-center font-medium">{quantity}</span>
                                <button
                                    className="p-3 hover:bg-gray-50"
                                    onClick={() => setQuantity(q => q + 1)}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                addToCart(product, quantity);
                                setQuantity(1);
                            }}
                            className="btn btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
                        >
                            <ShoppingBag size={20} />
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
