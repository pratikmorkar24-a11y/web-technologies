import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalogue from './pages/Catalogue';
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBooks from './pages/admin/AdminBooks';
import AdminBookForm from './pages/admin/AdminBookForm';
import AdminOrders from './pages/admin/AdminOrders';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/catalogue" element={<Catalogue />} />
              <Route path="/books/:id" element={<BookDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/books" element={<AdminRoute><AdminBooks /></AdminRoute>} />
              <Route path="/admin/books/new" element={<AdminRoute><AdminBookForm /></AdminRoute>} />
              <Route path="/admin/books/:id/edit" element={<AdminRoute><AdminBookForm /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
