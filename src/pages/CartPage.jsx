import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const CartPage = () => {
    const { cartItems, cartDetails, updateQuantity, removeFromCart, applyDiscount, loading } = useCart();
    const navigate = useNavigate();
    const [codeInput, setCodeInput] = useState('');
    const [codeApplied, setCodeApplied] = useState(false);

    const handleApplyCode = () => {
        applyDiscount(codeInput.trim().toUpperCase());
        setCodeApplied(true);
    };

    return (
        <div className="cart-page-container">
            <h1>Your Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <p>Your cart is empty.</p>
                    <button onClick={() => navigate('/')}>Continue Shopping</button>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.id || item.productId} className="cart-item">
                                <img src={item.image || '/images/necklace-1.png'} alt={item.title} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <h3>{item.title}</h3>
                                    <p className="item-price">₹{item.price}</p>
                                </div>
                                <div className="cart-item-actions">
                                    <button onClick={() => updateQuantity(item.id || item.productId, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id || item.productId, item.quantity + 1)}>+</button>
                                </div>
                                <div className="cart-item-total">
                                    <p>₹{item.price * item.quantity}</p>
                                    <button className="remove-btn" onClick={() => removeFromCart(item.id || item.productId)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h3>Order Summary</h3>

                        {/* Discount Code */}
                        <div className="discount-row" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                            <input
                                type="text"
                                placeholder="Discount code (e.g. WELCOME10)"
                                value={codeInput}
                                onChange={e => { setCodeInput(e.target.value); setCodeApplied(false); }}
                                style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }}
                            />
                            <button
                                onClick={handleApplyCode}
                                style={{ padding: '8px 16px', background: '#2d2d2d', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                            >
                                Apply
                            </button>
                        </div>
                        {codeApplied && cartDetails.discount > 0 && (
                            <p style={{ color: 'green', fontSize: '13px', marginBottom: '8px' }}>✓ Discount applied!</p>
                        )}
                        {codeApplied && cartDetails.discount === 0 && (
                            <p style={{ color: '#c0392b', fontSize: '13px', marginBottom: '8px' }}>✗ Invalid discount code.</p>
                        )}

                        <div className="summary-row">
                            <span>Subtotal:</span>
                            <span>₹{loading ? '...' : cartDetails.subtotal.toFixed(2)}</span>
                        </div>
                        {cartDetails.discount > 0 && (
                            <div className="summary-row">
                                <span>Discount:</span>
                                <span>-₹{cartDetails.discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="summary-row total">
                            <span>Grand Total:</span>
                            <span>₹{loading ? '...' : cartDetails.grandTotal.toFixed(2)}</span>
                        </div>
                        <button className="checkout-btn" onClick={() => navigate('/checkout')}>
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
