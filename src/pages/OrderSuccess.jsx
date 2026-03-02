import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', padding: '150px 20px', fontFamily: 'Outfit' }}>
            <h1 style={{ fontSize: '48px', color: '#27ae60', marginBottom: '20px' }}>Thank You!</h1>
            <p style={{ fontSize: '18px', color: '#555', marginBottom: '40px' }}>
                Your order has been successfully placed. You will receive an email confirmation shortly.
            </p>
            <button
                onClick={() => navigate('/')}
                style={{
                    backgroundColor: '#1a1a1a',
                    color: '#fff',
                    padding: '15px 30px',
                    fontSize: '16px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Continue Shopping
            </button>
        </div>
    );
};

export default OrderSuccess;
