import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import AdminPortal from './pages/admin/AdminPortal';
import OrderSuccess from './pages/OrderSuccess';
import SignUpPage from './pages/SignUpPage';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />

              {/* Dynamic Product Pages */}
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/:categorySlug" element={<CategoryPage />} />

              {/* Cart & Checkout */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccess />} />

              {/* Protected Routes */}
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/admin" element={<AdminPortal />} />

            </Routes>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
