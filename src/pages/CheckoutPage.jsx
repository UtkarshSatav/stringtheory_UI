import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api';
import './CheckoutPage.css';

const CheckoutPage = () => {
    const { cartItems, cartDetails, clearCart } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', address: '', city: '', zip: '', paymentMethod: 'cod'
    });

    if (cartItems.length === 0) {
        return <div style={{ textAlign: 'center', padding: '100px' }}>Your cart is empty.</div>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            customerId: currentUser?.uid || null,
            customerDetails: { name: formData.name, email: formData.email, phone: formData.phone },
            shippingAddress: `${formData.address}, ${formData.city}, ${formData.zip}`,
            items: cartItems.map(i => ({ productId: i.id || i.productId, quantity: i.quantity })),
            discountCode: '', // Handle discount inputs similarly
            paymentMethod: formData.paymentMethod
        };

        try {
            const res = await orderApi.checkout(payload);
            if (res.success) {
                clearCart();
                navigate('/order-success');
            }
        } catch (error) {
            console.error("Checkout failed:", error);
            alert("Checkout failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page-container">
            <div className="checkout-form-section">
                <h2>Secure Checkout</h2>
                <form onSubmit={handleCheckout}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" name="name" required onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" name="email" required onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="tel" name="phone" required onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Shipping Address</label>
                        <input type="text" name="address" required onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>City</label>
                            <input type="text" name="city" required onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>ZIP/Postal Code</label>
                            <input type="text" name="zip" required onChange={handleChange} />
                        </div>
                    </div>

                    <h3>Payment Method</h3>
                    <div className="payment-options">
                        <label className="payment-option">
                            <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} />
                            <span>Cash on Delivery</span>
                        </label>
                        <label className="payment-option">
                            <input type="radio" name="paymentMethod" value="stripe" checked={formData.paymentMethod === 'stripe'} onChange={handleChange} />
                            <span>Credit/Debit Card (Stripe)</span>
                        </label>
                    </div>

                    <button type="submit" className="btn-place-order" disabled={loading}>
                        {loading ? 'Processing...' : `Place Order (₹${cartDetails.grandTotal})`}
                    </button>
                </form>
            </div>
            <div className="checkout-summary-section">
                <h3>Order Summary</h3>
                <div className="checkout-items">
                    {cartItems.map((item, idx) => (
                        <div key={idx} className="checkout-item-mini">
                            <img src={item.images?.[0] || item.image} alt={item.title} />
                            <div className="checkout-item-info">
                                <h4>{item.title}</h4>
                                <span>Qty: {item.quantity}</span>
                            </div>
                            <span className="checkout-item-price">₹{item.price * item.quantity}</span>
                        </div>
                    ))}
                </div>
                <div className="checkout-totals">
                    <p>Subtotal: <span>₹{cartDetails.subtotal.toFixed(2)}</span></p>
                    <p>Shipping: <span>Free</span></p>
                    {cartDetails.discount > 0 && <p className="discount">Discount: <span>-₹{cartDetails.discount.toFixed(2)}</span></p>}
                    <h3 className="final-total">Grand Total: <span>₹{cartDetails.grandTotal.toFixed(2)}</span></h3>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
