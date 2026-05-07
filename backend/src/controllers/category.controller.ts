import { Request, Response } from 'express';
import slugify from 'slugify';
import { Category } from '../models/Category.model';
import { Product } from '../models/Product.model';
import cloudinary from '../config/cloudinary';

// @desc    Update products in category (Admin)
// @route   PUT /api/admin/categories/:id/products
// @access  Private/Admin
export const updateCategoryProducts = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { addProductIds, removeProductIds } = req.body;

        if (addProductIds && addProductIds.length > 0) {
            await Product.updateMany(
                { _id: { $in: addProductIds } },
                { $addToSet: { categories: id as any } }
            );
        }

        if (removeProductIds && removeProductIds.length > 0) {
            await Product.updateMany(
                { _id: { $in: removeProductIds } },
                { $pull: { categories: id as any } }
            );
        }

        res.json({ message: 'Category products updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating category products.' });
    }
};

// @desc    Get all active categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find({ isActive: true }).sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching categories.' });
    }
};

// @desc    Create category (Admin)
// @route   POST /api/admin/categories
// @access  Private/Admin
export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description, section } = req.body;
        const slug = slugify(name, { lower: true });
        let image;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { folder: 'categories' });
            image = { public_id: result.public_id, url: result.secure_url };
        }
        const category = await Category.create({ name, slug, description, image, section });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating category.' });
    }
};

// @desc    Update category (Admin)
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
export const updateCategory = async (req: Request, res: Response) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found.' });
        const { name, description, isActive, section } = req.body;
        if (name) { category.name = name; category.slug = slugify(name, { lower: true }); }
        if (description !== undefined) category.description = description;
        if (isActive !== undefined) category.isActive = isActive;
        if (section !== undefined) category.section = section;
        if (req.file) {
            if (category.image?.public_id) await cloudinary.uploader.destroy(category.image.public_id);
            const result = await cloudinary.uploader.upload(req.file.path, { folder: 'categories' });
            category.image = { public_id: result.public_id, url: result.secure_url };
        }
        const updated = await category.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error updating category.' });
    }
};

// @desc    Delete category (Admin)
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found.' });

        // Protect the 'Trending Now' category from being deleted
        if (category.slug === 'trending-now') {
            return res.status(400).json({ 
                message: "The 'Trending Now' category is required for the homepage and cannot be deleted." 
            });
        }
        
        // Try to delete from Cloudinary but don't let it block DB deletion
        if (category.image?.public_id) {
            try {
                await cloudinary.uploader.destroy(category.image.public_id);
            } catch (clEr) {
                console.error('Cloudinary delete error:', clEr);
            }
        }
        
        await category.deleteOne();
        res.json({ message: 'Category deleted successfully.' });
    } catch (error: any) {
        console.error('Category delete core error:', error);
        res.status(500).json({ message: error.message || 'Server error deleting category.' });
    }
};
