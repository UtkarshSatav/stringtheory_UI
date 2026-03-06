import React, { useEffect, useState } from 'react';
import { orderApi, productApi, formApi, returnApi } from '../../../api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        lowStockCount: 0,
        pendingReturns: 0,
        newInquiries: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [ordersRes, productsRes, inquiriesRes, returnsRes] = await Promise.all([
                orderApi.getOrders(),
                productApi.getProducts(),
                formApi.getContactInquiries(),
                returnApi.getReturns()
            ]);

            const orders = ordersRes.data || [];
            const products = productsRes.data || [];
            const inquiries = inquiriesRes.data || [];
            const returns = returnsRes.data || [];

            // Calculate Revenue (Paid, Shipped, Delivered)
            const revenue = orders
                .filter(o => ['Paid', 'Shipped', 'Delivered'].includes(o.orderStatus))
                .reduce((acc, o) => acc + (o.grandTotal || 0), 0);

            const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;
            const lowStock = products.filter(p => (p.stockQuantity || 0) < 5);
            const pendingRet = returns.filter(r => r.status === 'Pending').length;

            setStats({
                totalRevenue: revenue,
                totalOrders: orders.length,
                pendingOrders,
                lowStockCount: lowStock.length,
                pendingReturns: pendingRet,
                newInquiries: inquiries.length
            });

            setRecentOrders(orders.slice(0, 5));
            setLowStockProducts(lowStock.slice(0, 5));

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) return <div className="dashboard-loading">Loading Dashboard Data...</div>;

    return (
        <div className="admin-dashboard">
            <div className="admin-header-row">
                <h2>Dashboard Overview</h2>
                <button className="btn-refresh" onClick={fetchDashboardData}>Refresh Data</button>
            </div>

            <div className="stats-grid">
                <div className="stat-card revenue">
                    <div className="stat-icon">₹</div>
                    <div className="stat-info">
                        <h3>Total Revenue</h3>
                        <p className="stat-value">₹{stats.totalRevenue.toLocaleString()}</p>
                    </div>
                </div>
                <div className="stat-card orders">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                        <h3>Total Orders</h3>
                        <p className="stat-value">{stats.totalOrders}</p>
                        <span className="stat-sub">{stats.pendingOrders} Pending</span>
                    </div>
                </div>
                <div className="stat-card stock">
                    <div className="stat-icon">⚠️</div>
                    <div className="stat-info">
                        <h3>Low Stock</h3>
                        <p className="stat-value">{stats.lowStockCount}</p>
                        <span className="stat-sub">Items below 5 qty</span>
                    </div>
                </div>
                <div className="stat-card returns">
                    <div className="stat-icon">🔄</div>
                    <div className="stat-info">
                        <h3>Pending Returns</h3>
                        <p className="stat-value">{stats.pendingReturns}</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content-grid">
                <div className="dashboard-section recent-orders">
                    <div className="section-header">
                        <h3>Recent Orders</h3>
                    </div>
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map(order => (
                                <tr key={order.id}>
                                    <td>#{order.id.slice(-6).toUpperCase()}</td>
                                    <td>{order.customerDetails?.name || 'Guest'}</td>
                                    <td>₹{order.grandTotal}</td>
                                    <td><span className={`status-pill ${order.orderStatus}`}>{order.orderStatus}</span></td>
                                </tr>
                            ))}
                            {recentOrders.length === 0 && <tr><td colSpan="4">No recent orders</td></tr>}
                        </tbody>
                    </table>
                </div>

                <div className="dashboard-section low-stock">
                    <div className="section-header">
                        <h3>Low Stock Alert</h3>
                    </div>
                    <div className="low-stock-list">
                        {lowStockProducts.map(product => (
                            <div key={product.id} className="low-stock-item">
                                <div className="product-thumb">
                                    <img src={product.images?.[0] || product.image} alt={product.title} />
                                </div>
                                <div className="product-details">
                                    <h4>{product.title}</h4>
                                    <p>Stock: <span className="urgent">{product.stockQuantity} remaining</span></p>
                                </div>
                            </div>
                        ))}
                        {lowStockProducts.length === 0 && <p className="empty-msg">All items well stocked!</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
