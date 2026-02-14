import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/Layout';

// Pages
import { Home } from './pages/storefront/Home';
import { Catalog } from './pages/storefront/Catalog';
import { ProductDetail } from './pages/storefront/ProductDetail';
import { Checkout } from './pages/storefront/Checkout';
import { Login } from './pages/Login';

// Admin
import { AdminLayout, Dashboard } from './pages/admin/Dashboard';
import { ProductList } from './pages/admin/ProductList';
import { OrderList } from './pages/admin/OrderList';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="catalog" element={<Catalog />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="login" element={<Login />} />
              {/* Admin nested under main layout? No, usually standalone */}
            </Route>

            {/* Admin Routes - Standalone Layout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductList />} />
              <Route path="orders" element={<OrderList />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
