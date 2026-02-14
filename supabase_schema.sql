-- Create Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  compare_at_price NUMERIC,
  images JSONB DEFAULT '[]', -- Array of image URLs
  category TEXT,
  inventory_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create Orders Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id), -- Nullable for guest checkout
  status TEXT DEFAULT 'pending', -- pending, paid, shipped, cancelled
  total_price NUMERIC NOT NULL,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create Order Items Table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_purchase NUMERIC NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies for Products
-- Everyone can read products
CREATE POLICY "Public products are viewable by everyone" 
ON products FOR SELECT USING (true);

-- Only authenticated admins can insert/update/delete (Simplified: Allow all authenticated for demo, or create separate admin role in production)
-- For this MVP, we will allow any authenticated user to manage products to simplify the Admin Dashboard login.
CREATE POLICY "Authenticated users can manage products" 
ON products FOR ALL USING (auth.role() = 'authenticated');

-- Policies for Orders
-- Users can view their own orders
CREATE POLICY "Users can view own orders" 
ON orders FOR SELECT USING (auth.uid() = user_id);

-- Users can create orders
CREATE POLICY "Users can create orders" 
ON orders FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Seed Data (Optional - specific IDs for consistent testing)
INSERT INTO products (title, description, price, category, images, inventory_quantity)
VALUES 
('Classic White Tee', 'A timeless classic. 100% Cotton.', 29.99, 'Apparel', '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800"]', 100),
('Denim Jacket', 'Vintage inspired denim jacket.', 89.99, 'Apparel', '["https://images.unsplash.com/photo-1576995853123-5a2946d3330e?auto=format&fit=crop&w=800&q=80"]', 50),
('Canvas Sneakers', 'Comfortable everyday sneakers.', 59.99, 'Footwear', '["https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80"]', 75);
