import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { customerApi } from '../api';
import './SignUpPage.css';

const SignUpPage = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            // 1. Create Firebase Auth user
            const userCredential = await signup(formData.email, formData.password);
            const user = userCredential.user;

            // 2. Sync to Firestore backend
            // Get the token so we can authenticate the API call
            const token = await user.getIdToken();
            localStorage.setItem('auth_token', token);

            await customerApi.syncCustomer({
                uid: user.uid,
                email: formData.email,
                name: formData.name,
                phone: formData.phone
            });

            // 3. Navigate to profile
            navigate('/profile');
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <h2>Create an Account</h2>
            <p className="signup-subtitle">Join The String Theory to track your orders and checkout faster.</p>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSignup} className="signup-form">
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="e.g. Jane Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="jane@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Phone Number (Optional)</label>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="At least 6 characters"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                    />
                </div>

                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                    />
                </div>

                <button type="submit" className="btn-signup" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>

            <div className="login-prompt">
                <p>Already have an account? <Link to="/profile">Sign In here</Link>.</p>
            </div>
        </div>
    );
};

export default SignUpPage;
