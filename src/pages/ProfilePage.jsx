import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { customerApi, returnApi } from '../api';
import './ProfilePage.css';

const ProfilePage = () => {
    const { currentUser, login, logout } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!currentUser) return;
        setOrdersLoading(true);
        setOrdersError('');
        customerApi.getOrders()
            .then(res => setOrders(res.data || []))
            .catch(err => setOrdersError(err.response?.data?.message || 'Failed to load orders.'))
            .finally(() => setOrdersLoading(false));
    }, [currentUser]);

    const formatDate = (ts) => {
        if (!ts) return '—';
        const date = ts._seconds ? new Date(ts._seconds * 1000) : new Date(ts);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const statusColor = (status) => {
        const map = { Pending: '#e67e22', Paid: '#27ae60', Shipped: '#2980b9', Delivered: '#16a085', Cancelled: '#c0392b' };
        return map[status] || '#888';
    };

    const handleTrackOrder = (e) => {
        e.preventDefault();
        const orderId = e.target.orderId.value.trim();
        if (orderId) {
            // Future: integrate with a tracking API or dedicated tracking page
            alert(`Tracking information for Order #${orderId} will be available soon.`);
        }
    };

    const [returnFormOpen, setReturnFormOpen] = useState(false);
    const [returnFormData, setReturnFormData] = useState({ orderId: '', reason: '' });
    const [returnStatus, setReturnStatus] = useState({ loading: false, error: '', success: false });

    const handleReturnSubmit = async (e) => {
        e.preventDefault();
        setReturnStatus({ loading: true, error: '', success: false });
        try {
            await returnApi.createReturn({
                ...returnFormData,
                email: currentUser.email
            });
            setReturnStatus({ loading: false, error: '', success: true });
            setReturnFormData({ orderId: '', reason: '' });
            setTimeout(() => setReturnFormOpen(false), 3000);
        } catch (err) {
            setReturnStatus({ loading: false, error: err.response?.data?.message || 'Failed to submit return request.', success: false });
        }
    };

    if (currentUser) {
        return (
            <div className="profile-container">
                <h1>My Account</h1>

                <div className="profile-layout">
                    {/* LEFT COLUMN: Profile Info & Order History */}
                    <div className="profile-main">
                        <div className="profile-card">
                            <p><strong>Email:</strong> {currentUser.email}</p>
                            <button className="btn-logout" onClick={logout}>Logout</button>
                        </div>

                        <div className="order-history">
                            <h2>Order History</h2>

                            {ordersLoading && <p style={{ color: '#888', padding: '20px 0' }}>Loading your orders...</p>}
                            {ordersError && <p style={{ color: '#c0392b', padding: '10px 0' }}>{ordersError}</p>}

                            {!ordersLoading && !ordersError && orders.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                                    <p>No orders yet.</p>
                                    <button
                                        onClick={() => navigate('/')}
                                        style={{ marginTop: '12px', padding: '10px 24px', background: '#2d2d2d', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            )}

                            {!ordersLoading && orders.map(order => (
                                <div key={order.id} className="order-card">
                                    <div className="order-card-header">
                                        <div>
                                            <span className="order-label">Order ID</span>
                                            <p className="order-val">#{order.id.slice(-8).toUpperCase()}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span className="order-label">Placed on</span>
                                            <p className="order-val">{formatDate(order.createdAt)}</p>
                                        </div>
                                        <span className="order-badge" style={{ background: statusColor(order.orderStatus) }}>
                                            {order.orderStatus}
                                        </span>
                                    </div>

                                    <div className="order-items">
                                        {(order.items || []).map((item, i) => (
                                            <div key={i} className="order-item-row">
                                                <span className="item-name">{item.title} <span className="item-qty">× {item.quantity}</span></span>
                                                <span className="item-price">₹{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="order-footer">
                                        <span className="order-payment">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}</span>
                                        <span className="order-total">Total: ₹{order.grandTotal}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Quick Links / Support */}
                    <div className="profile-sidebar">
                        <div className="sidebar-card">
                            <h3>Track Order</h3>
                            <p>Enter your Order ID to check its current shipping status.</p>
                            <form onSubmit={handleTrackOrder} className="track-form">
                                <input type="text" name="orderId" placeholder="e.g. A1B2C3D4" required />
                                <button type="submit">Track</button>
                            </form>
                        </div>

                        <div className="sidebar-card">
                            <h3>Need Help?</h3>
                            <p>Our support team is available Monday to Friday, 9 AM to 6 PM.</p>
                            <div className="contact-details">
                                <p>📧 <a href="mailto:support@thestringtheory.com">support@thestringtheory.com</a></p>
                                <p>📞 <a href="tel:+919876543210">+91 9876543210</a></p>
                            </div>
                        </div>

                        <div className="sidebar-card">
                            <h3>Returns & Refunds</h3>
                            <p>We accept returns within 7 days of delivery for defective or unused items in their original packaging.</p>

                            {!returnFormOpen ? (
                                <button
                                    onClick={() => setReturnFormOpen(true)}
                                    className="btn-return"
                                >
                                    Start a Return Request
                                </button>
                            ) : (
                                <form onSubmit={handleReturnSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                                    <input
                                        type="text"
                                        placeholder="Order ID"
                                        value={returnFormData.orderId}
                                        onChange={e => setReturnFormData({ ...returnFormData, orderId: e.target.value })}
                                        required
                                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                                    />
                                    <textarea
                                        placeholder="Reason for return"
                                        value={returnFormData.reason}
                                        onChange={e => setReturnFormData({ ...returnFormData, reason: e.target.value })}
                                        required
                                        rows="3"
                                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', resize: 'vertical' }}
                                    />
                                    {returnStatus.error && <p style={{ color: '#e74c3c', fontSize: '13px' }}>{returnStatus.error}</p>}
                                    {returnStatus.success && <p style={{ color: '#27ae60', fontSize: '13px', fontWeight: '600' }}>Request submitted successfully!</p>}

                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            type="submit"
                                            disabled={returnStatus.loading || returnStatus.success}
                                            style={{ flex: 1, padding: '10px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                                        >
                                            {returnStatus.loading ? 'Submitting...' : 'Submit'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setReturnFormOpen(false)}
                                            style={{ padding: '10px', background: '#f5f5f5', color: '#666', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer' }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <h2>Sign In</h2>
            <p>Sign in to view your order history and profile.</p>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleLogin} className="login-form">
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Authenticating...' : 'Sign In'}
                </button>
            </form>
            <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#666', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <p>Don't have an account? <Link to="/signup" style={{ color: '#1a1a1a', fontWeight: '600', textDecoration: 'none' }}>Sign Up here</Link>.</p>
            </div>
        </div>
    );
};

export default ProfilePage;
