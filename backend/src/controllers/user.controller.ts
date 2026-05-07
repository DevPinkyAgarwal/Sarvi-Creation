import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.model';
import generateToken from '../utils/generateToken';

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({ name, email, password: hashedPassword, phone });
        generateToken(res, (user._id as any).toString());
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        generateToken(res, (user._id as any).toString());
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login.' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
export const logoutUser = (req: Request, res: Response) => {
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully.' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ _id: user._id, name: user.name, email: user.email, phone: user.phone, addresses: user.addresses, wishlist: user.wishlist });
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 12);
        }
        const updatedUser = await user.save();
        res.json({ _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, phone: updatedUser.phone });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating profile.' });
    }
};

// @desc    Add/Update/Delete address
// @route   PUT /api/users/address
// @access  Private
export const manageAddress = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        const { action, addressId, address } = req.body;

        if (action === 'add') {
            user.addresses.push(address);
        } else if (action === 'update' && addressId) {
            const idx = user.addresses.findIndex((a: any) => a._id.toString() === addressId);
            if (idx !== -1) user.addresses[idx] = { ...user.addresses[idx], ...address };
        } else if (action === 'delete' && addressId) {
            user.addresses = user.addresses.filter((a: any) => a._id.toString() !== addressId) as any;
        }
        await user.save();
        res.json({ addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ message: 'Server error managing address.' });
    }
};

// @desc    Toggle wishlist item
// @route   PUT /api/users/wishlist/:productId
// @access  Private
export const toggleWishlist = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        const productId = req.params.productId as any;
        const idx = user.wishlist.findIndex((id: any) => id.toString() === productId);
        if (idx > -1) {
            user.wishlist.splice(idx, 1);
        } else {
            user.wishlist.push(productId);
        }
        await user.save();
        res.json({ wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating wishlist.' });
    }
};
