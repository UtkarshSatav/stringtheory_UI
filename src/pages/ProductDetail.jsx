import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetail.css';

import { productApi } from '../api';
import { useCart } from '../context/CartContext';

const ProductDetail = ({ allProducts }) => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [toast, setToast] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);

        // Fetch product from backend
        setLoading(true);
        productApi.getProductById(productId)
            .then(res => {
                if (res.success) {
                    setProduct(res.data);
                } else {
                    navigate('/');
                }
            })
            .catch(err => {
                console.error("Failed to load product", err);
                // Also check if it's in allProducts (fallback for static demo)
                const found = allProducts?.find(p => p.id === productId);
                if (found) setProduct(found);
                else navigate('/');
            })
            .finally(() => setLoading(false));

    }, [productId, allProducts, navigate]);

    if (loading || !product) {
        return (
            <div className="product-detail-loading">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading Product...</p>
                </div>
            </div>
        );
    }

    // Generate additional product images. Use the images array if available, or fallback to the single image.
    const productImages = product.images && product.images.length > 0
        ? product.images
        : [product.image, product.image, product.image, product.image];

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setToast(`${quantity} × ${product.title} added to cart!`);
        setTimeout(() => setToast(''), 2500);
    };

    const handleBuyNow = () => {
        addToCart(product, quantity);
        navigate('/cart');
    };

    return (
        <div className="product-detail-page">
            {/* Toast notification */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
                    background: '#2d2d2d', color: '#fff', padding: '12px 24px',
                    borderRadius: '8px', zIndex: 9999, fontSize: '14px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}>
                    ✓ {toast}
                </div>
            )}
            <div className="product-detail-container">
                {/* Breadcrumb */}
                <div className="breadcrumb">
                    <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
                    <span className="breadcrumb-separator">/</span>
                    <span onClick={() => navigate(`/${product.category.toLowerCase()}`)} className="breadcrumb-link">
                        {product.category}
                    </span>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">{product.title}</span>
                </div>

                <div className="product-detail-content">
                    {/* Image Gallery */}
                    <div className="product-gallery">
                        <div className="gallery-thumbnails">
                            {productImages.map((img, index) => (
                                <div
                                    key={index}
                                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(index)}
                                >
                                    <img src={img} alt={`${product.title} view ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                        <div className="gallery-main">
                            <div className="main-image-wrapper" style={{ backgroundColor: product.metadata?.bgColor || product.bgColor || '#f5f0eb' }}>
                                <img src={productImages[selectedImage]} alt={product.title} />
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="product-info">
                        <div className="product-header">
                            <span className="product-category-tag">{product.category}</span>
                            <h1 className="product-title">{product.title}</h1>
                            <p className="product-subtitle">{product.subtitle}</p>
                        </div>

                        <div className="product-pricing">
                            <div className="price-row">
                                <span className="current-price">₹{product.price}</span>
                                {(product.compareAtPrice || product.originalPrice) && (
                                    <span className="original-price">₹{product.compareAtPrice || product.originalPrice}</span>
                                )}
                                {(product.metadata?.discount || product.discount) && (
                                    <span className="discount-badge">{product.metadata?.discount || product.discount}</span>
                                )}
                            </div>
                            <p className="tax-info">Inclusive of all taxes</p>
                        </div>

                        {/* Product Features */}
                        <div className="product-features">
                            <div className="feature-item">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <div>
                                    <strong>Cash on Delivery</strong>
                                    <p>Available</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="23 4 23 10 17 10"></polyline>
                                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                                </svg>
                                <div>
                                    <strong>Easy 5 days return</strong>
                                    <p>Change of mind applicable</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="1" y="3" width="15" height="13"></rect>
                                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                                </svg>
                                <div>
                                    <strong>Free Delivery</strong>
                                    <p>Get it delivered in 3-5 days</p>
                                </div>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="quantity-selector">
                            <label>Quantity:</label>
                            <div className="quantity-controls">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="quantity-value">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="product-actions">
                            <button className="btn-buy-now" onClick={handleBuyNow}>
                                BUY NOW
                            </button>
                            <button className="btn-add-to-cart" onClick={handleAddToCart}>
                                ADD TO CART
                            </button>
                        </div>

                        {/* Product Information */}
                        <div className="product-details-section">
                            <h3>Product Information</h3>
                            <div className="details-grid">
                                <div className="detail-row">
                                    <span className="detail-label">Brand</span>
                                    <span className="detail-value">DCA</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Pack Of</span>
                                    <span className="detail-value">1</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Product Type</span>
                                    <span className="detail-value">{product.category}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Safety Features</span>
                                    <span className="detail-value">Keep Away From Perfume And Water</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Occasion</span>
                                    <span className="detail-value">Party & Festive</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Ideal For</span>
                                    <span className="detail-value">Women</span>
                                </div>
                            </div>
                        </div>

                        {/* Product Description */}
                        <div className="product-description-section">
                            <h3>Product Description</h3>
                            <p>
                                This {product.title.toLowerCase()} features a delicate blend of natural elegance
                                and modern style. Crafted with polished materials, it offers a sophisticated yet
                                beachy vibe, perfect for elevating any outfit. The lightweight design ensures
                                comfortable wear, while the adjustable clasp allows for a customizable fit.
                                Ideal for casual outings or special occasions, this {product.category.toLowerCase()} adds a touch of
                                coastal charm to your look. Whether paired with a summer dress or a chic blouse,
                                it's a versatile accessory that enhances your feminine grace.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
