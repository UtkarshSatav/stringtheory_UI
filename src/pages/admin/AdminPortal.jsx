import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import AdminDashboard from './components/AdminDashboard';
import AdminOrders from './components/AdminOrders';
import AdminProducts from './components/AdminProducts';
import AdminCustomers from './components/AdminCustomers';
import AdminCollections from './components/AdminCollections';
import AdminForms from './components/AdminForms';
import AdminReturns from './components/AdminReturns';

import './AdminPortal.css';

const AdminPortal = () => {
    const { currentUser, isAdmin } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        // Enforce admin login
        if (!currentUser || !isAdmin) {
            navigate('/profile');
            return;
        }
    }, [currentUser, isAdmin, navigate]);

    return (
        <div className="admin-portal-container">
            <div className="admin-sidebar">
                <div className="admin-logo">
                    <h2>Admin Panel</h2>
                    <p>{currentUser?.email}</p>
                </div>
                <ul>
                    <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>Dashboard</li>
                    <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Orders</li>
                    <li className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>Products</li>
                    <li className={activeTab === 'collections' ? 'active' : ''} onClick={() => setActiveTab('collections')}>Collections</li>
                    <li className={activeTab === 'customers' ? 'active' : ''} onClick={() => setActiveTab('customers')}>Customers</li>
                    <li className={activeTab === 'returns' ? 'active' : ''} onClick={() => setActiveTab('returns')}>Returns & Refunds</li>
                    <li className={activeTab === 'forms' ? 'active' : ''} onClick={() => setActiveTab('forms')}>Contact Inquiries</li>
                </ul>
            </div>
            <div className="admin-content">
                {activeTab === 'dashboard' && <AdminDashboard />}
                {activeTab === 'orders' && <AdminOrders />}
                {activeTab === 'products' && <AdminProducts />}
                {activeTab === 'collections' && <AdminCollections />}
                {activeTab === 'customers' && <AdminCustomers />}
                {activeTab === 'returns' && <AdminReturns />}
                {activeTab === 'forms' && <AdminForms />}
            </div>
        </div>
    );
};

export default AdminPortal;
