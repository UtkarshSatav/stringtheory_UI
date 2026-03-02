import apiClient from './client';

export const productApi = {
    // Public
    getProducts: (params) => apiClient.get('/products', { params }).then(res => res.data),
    getProductById: (id) => apiClient.get(`/products/${id}`).then(res => res.data),

    // Admin
    createProduct: (data) => apiClient.post('/products', data).then(res => res.data),
    updateProduct: (id, data) => apiClient.put(`/products/${id}`, data).then(res => res.data),
    deleteProduct: (id) => apiClient.delete(`/products/${id}`).then(res => res.data),
};

export const collectionApi = {
    getCollections: () => apiClient.get('/collections').then(res => res.data),
    createCollection: (data) => apiClient.post('/collections', data).then(res => res.data),
    assignProduct: (id, productId) => apiClient.post(`/collections/${id}/assign`, { productId }).then(res => res.data),
};

export const cartApi = {
    validateCart: (payload) => apiClient.post('/cart/validate', payload).then(res => res.data),
};

export const orderApi = {
    checkout: (payload) => apiClient.post('/orders/checkout', payload).then(res => res.data),
    // Admin
    getOrders: () => apiClient.get('/orders').then(res => res.data),
    updateStatus: (id, status) => apiClient.put(`/orders/${id}/status`, { status }).then(res => res.data),
};

export const formApi = {
    subscribeNewsletter: (email) => apiClient.post('/forms/newsletter', { email }).then(res => res.data),
    submitContact: (data) => apiClient.post('/forms/contact', data).then(res => res.data),
    // Admin
    getContactInquiries: () => apiClient.get('/forms/contact').then(res => res.data),
    getNewsletters: () => apiClient.get('/forms/newsletter').then(res => res.data),
};

export const customerApi = {
    getProfile: () => apiClient.get('/customers/profile').then(res => res.data),
    getOrders: () => apiClient.get('/customers/orders').then(res => res.data),
    syncCustomer: (data) => apiClient.post('/customers/sync', data).then(res => res.data),
};

export const returnApi = {
    createReturn: (data) => apiClient.post('/returns', data).then(res => res.data),
    // Admin
    getReturns: () => apiClient.get('/returns').then(res => res.data),
    updateStatus: (id, status) => apiClient.put(`/returns/${id}/status`, { status }).then(res => res.data),
};
