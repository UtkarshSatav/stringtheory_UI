import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartDetails, setCartDetails] = useState({ subtotal: 0, discount: 0, grandTotal: 0 });
    const [discountCode, setDiscountCode] = useState('');
    const [loading, setLoading] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('cart');
        if (saved) {
            try {
                setCartItems(JSON.parse(saved));
            } catch {
                localStorage.removeItem('cart');
            }
        }
    }, []);

    // Sync to local storage on change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Stable validateCart using useCallback — safe to put in deps
    const validateCart = useCallback(async (items, code = '') => {
        if (!items || items.length === 0) {
            setCartDetails({ subtotal: 0, discount: 0, grandTotal: 0 });
            return;
        }
        setLoading(true);
        try {
            const payload = {
                items: items.map(i => ({ productId: i.id || i.productId, quantity: i.quantity })),
                discountCode: code
            };
            const res = await cartApi.validateCart(payload);
            if (res.success && res.data) {
                setCartDetails({
                    subtotal: res.data.subtotal,
                    discount: res.data.discount,
                    grandTotal: res.data.grandTotal,
                });
            }
        } catch (err) {
            console.error('Cart Validation Error:', err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Validate whenever cart items change (NOT on every discount keypress)
    useEffect(() => {
        validateCart(cartItems, discountCode);
    }, [cartItems]); // eslint-disable-line react-hooks/exhaustive-deps

    // Explicit discount apply — called by user pressing "Apply"
    const applyDiscount = (code) => {
        setDiscountCode(code);
        validateCart(cartItems, code);
    };

    const addToCart = (product, quantity = 1) => {
        setCartItems(prev => {
            const existing = prev.find(item => (item.id || item.productId) === (product.id || product.productId));
            if (existing) {
                return prev.map(item =>
                    (item.id || item.productId) === (product.id || product.productId)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => (item.id || item.productId) !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) return removeFromCart(productId);
        setCartItems(prev =>
            prev.map(item => (item.id || item.productId) === productId ? { ...item, quantity } : item)
        );
    };

    const clearCart = () => {
        setCartItems([]);
        setDiscountCode('');
        setCartDetails({ subtotal: 0, discount: 0, grandTotal: 0 });
        localStorage.removeItem('cart');
    };

    // Compute local subtotal instantly (no async needed) so UI never shows ₹0
    const localSubtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            cartDetails: loading
                ? { ...cartDetails, subtotal: cartDetails.subtotal || localSubtotal, grandTotal: cartDetails.grandTotal || localSubtotal }
                : cartDetails,
            discountCode,
            setDiscountCode,
            applyDiscount,
            loading,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            validateCart: () => validateCart(cartItems, discountCode),
        }}>
            {children}
        </CartContext.Provider>
    );
};
