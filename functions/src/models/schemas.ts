import Joi from 'joi';

export const productSchema = Joi.object({
    title: Joi.string().required(),
    slug: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().min(0).required(),
    images: Joi.array().items(Joi.string().uri()).required(),
    active: Joi.boolean().default(true),
    stockQuantity: Joi.number().integer().min(0).required(),
    collectionIds: Joi.array().items(Joi.string()).default([]),
});

export const collectionSchema = Joi.object({
    title: Joi.string().required(),
    slug: Joi.string().required(),
    description: Joi.string().allow('', null).optional(),
});

export const cartValidateSchema = Joi.object({
    items: Joi.array().items(
        Joi.object({
            productId: Joi.string().required(),
            quantity: Joi.number().integer().min(1).required(),
        })
    ).min(1).required(),
    discountCode: Joi.string().allow('', null).optional(),
});

export const checkoutSchema = Joi.object({
    customerId: Joi.string().allow('', null).optional(),
    customerDetails: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required()
    }).required(),
    shippingAddress: Joi.string().required(),
    items: Joi.array().items(
        Joi.object({
            productId: Joi.string().required(),
            quantity: Joi.number().integer().min(1).required(),
        })
    ).min(1).required(),
    discountCode: Joi.string().allow('', null).optional(),
    paymentMethod: Joi.string().valid('stripe', 'razorpay', 'cod').required(),
});

export const stockAdjustSchema = Joi.object({
    quantity: Joi.number().integer().required(),
});

export const orderStatusSchema = Joi.object({
    status: Joi.string().valid('Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled').required()
});

export const newsletterSchema = Joi.object({
    email: Joi.string().email().required()
});

export const contactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow('', null).optional(),
    message: Joi.string().required(),
});

export const returnRequestSchema = Joi.object({
    orderId: Joi.string().required(),
    reason: Joi.string().required(),
    email: Joi.string().email().allow('', null).optional()
});

export const returnStatusSchema = Joi.object({
    status: Joi.string().valid('Pending', 'Approved', 'Rejected', 'Refunded').required()
});
