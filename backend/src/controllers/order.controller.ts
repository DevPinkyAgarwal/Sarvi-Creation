import { Request, Response } from 'express';
import { Order } from '../models/Order.model';
import { Product } from '../models/Product.model';
import { emitStatsUpdate } from '../utils/socket';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req: Request, res: Response) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items provided.' });
        }
        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });
        const createdOrder = await order.save();
        emitStatsUpdate();
        res.status(201).json(createdOrder);
    } catch (error: any) {
        console.error('Create Order Error:', error);
        res.status(500).json({ 
            message: 'Server error creating order.',
            error: error.message 
        });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching orders.' });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req: Request, res: Response) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) return res.status(404).json({ message: 'Order not found.' });
        // Allow only the owner or admin to view
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this order.' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching order.' });
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req: Request, res: Response) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found.' });
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer?.email_address,
        };
        order.status = 'Processing';
        const updated = await order.save();
        emitStatsUpdate();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error updating payment.' });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const query: any = {};
        if (status) query.status = status;
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const total = await Order.countDocuments(query);
        const orders = await Order.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);
        res.json({ orders, page: pageNum, pages: Math.ceil(total / limitNum), total });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching orders.' });
    }
};

// @desc    Update order status (Admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found.' });
        order.status = req.body.status;
        if (req.body.status === 'Delivered') order.deliveredAt = new Date();
        const updated = await order.save();
        emitStatsUpdate();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error updating order status.' });
    }
};

// @desc    Admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'Pending' });
        const revenueResult = await Order.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        const topProducts = await Order.aggregate([
            { $unwind: '$orderItems' },
            { $group: { _id: '$orderItems.product', totalSold: { $sum: '$orderItems.quantity' }, revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } } } },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
            { $unwind: '$product' },
            { $project: { productName: '$product.name', totalSold: 1, revenue: 1 } },
        ]);

        const lowStockProducts = await Product.find({
            isActive: true,
            'variants.stockQuantity': { $lte: 5 },
        }).select('name variants');

        // Revenue per month for last 6 months
        const revenueChart = await Order.aggregate([
            { $match: { isPaid: true, createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) } } },
            { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$totalPrice' } } },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);

        // Recent 5 orders for dashboard
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5)
            .select('user totalPrice status isPaid createdAt');

        res.json({ totalOrders, pendingOrders, totalRevenue, topProducts, lowStockProducts, revenueChart, recentOrders });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching stats.' });
    }
};
