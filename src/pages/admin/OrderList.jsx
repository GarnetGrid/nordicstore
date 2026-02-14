import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export function OrderList() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        async function fetchOrders() {
            const { data } = await supabase
                .from('orders')
                .select(`
          *,
          user:user_id(email)
        `)
                .order('created_at', { ascending: false });
            setOrders(data || []);
        }
        fetchOrders();
    }, []);

    return (
        <div>
            <h1 className="h2 mb-8">Orders</h1>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-medium text-gray-500">Order ID</th>
                            <th className="p-4 font-medium text-gray-500">Date</th>
                            <th className="p-4 font-medium text-gray-500">Customer</th>
                            <th className="p-4 font-medium text-gray-500">Total</th>
                            <th className="p-4 font-medium text-gray-500">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="p-4 font-mono text-sm text-gray-600">{order.id.slice(0, 8)}...</td>
                                <td className="p-4 text-gray-600">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    {order.shipping_address?.email || order.user?.email || 'Guest'}
                                </td>
                                <td className="p-4 font-medium">${order.total_price}</td>
                                <td className="p-4">
                                    <span className={`badge ${order.status === 'paid' ? 'bg-green-100 text-green-700' :
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
