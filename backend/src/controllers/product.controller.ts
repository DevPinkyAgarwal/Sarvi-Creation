import { Request, Response } from 'express';
import { Product } from '../models/Product.model';
import { Category } from '../models/Category.model';
import cloudinary from '../config/cloudinary';

// @desc    Get all products (with filters, sort, pagination)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
    try {
        const { category, minPrice, maxPrice, material, purity, sort, search, page = 1, limit = 12 } = req.query;
        const query: any = { isActive: true };

        if (category) {
            const cat = await Category.findOne({ slug: category });
            if (cat) query.categories = cat._id;
        }
        if (search) query.name = { $regex: search, $options: 'i' };
        if (material) query['variants.material'] = material;
        if (purity) query['variants.purity'] = purity;
        if (minPrice || maxPrice) {
            query['variants.priceAmount'] = {};
            if (minPrice) query['variants.priceAmount'].$gte = Number(minPrice);
            if (maxPrice) query['variants.priceAmount'].$lte = Number(maxPrice);
        }

        const sortOptions: any = {};
        if (sort === 'price_asc') sortOptions['variants.priceAmount'] = 1;
        else if (sort === 'price_desc') sortOptions['variants.priceAmount'] = -1;
        else if (sort === 'newest') sortOptions.createdAt = -1;
        else if (sort === 'popular') sortOptions.ratingsQuantity = -1;
        else sortOptions.createdAt = -1; // default

        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const total = await Product.countDocuments(query);
        const products = await Product.find(query).populate('categories', 'name slug').sort(sortOptions).skip(skip).limit(limitNum);

        res.json({ products, page: pageNum, pages: Math.ceil(total / limitNum), total });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching products.' });
    }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req: Request, res: Response) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate('categories', 'name slug');
        if (!product) return res.status(404).json({ message: 'Product not found.' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching product.' });
    }
};

// @desc    Create a product (Admin)
// @route   POST /api/admin/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, slug, description, categories, basePrice, makingCharges, gstPercentage, variants } = req.body;
        const product = new Product({ name, slug, description, categories, basePrice, makingCharges, gstPercentage, variants, images: [] });

        if (req.files && Array.isArray(req.files)) {
            const uploadPromises = (req.files as Express.Multer.File[]).map((file) =>
                cloudinary.uploader.upload(file.path, { folder: 'products' })
            );
            const results = await Promise.all(uploadPromises);
            product.images = results.map((r, i) => ({ public_id: r.public_id, url: r.secure_url, isPrimary: i === 0 }));
        }

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating product.' });
    }
};

// @desc    Update a product (Admin)
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found.' });

        const { name, slug, description, categories, basePrice, makingCharges, gstPercentage, variants, isActive } = req.body;
        if (name) product.name = name;
        if (slug) product.slug = slug;
        if (description) product.description = description;
        if (categories) product.categories = categories;
        if (basePrice !== undefined) product.basePrice = basePrice;
        if (makingCharges !== undefined) product.makingCharges = makingCharges;
        if (gstPercentage !== undefined) product.gstPercentage = gstPercentage;
        if (variants) product.variants = variants;
        if (isActive !== undefined) product.isActive = isActive;

        if (req.files && Array.isArray(req.files) && (req.files as Express.Multer.File[]).length > 0) {
            const uploadPromises = (req.files as Express.Multer.File[]).map((file) =>
                cloudinary.uploader.upload(file.path, { folder: 'products' })
            );
            const results = await Promise.all(uploadPromises);
            const newImages = results.map((r, i) => ({ public_id: r.public_id, url: r.secure_url, isPrimary: false }));
            product.images = [...product.images, ...newImages];
        }

        const updated = await product.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error updating product.' });
    }
};

// @desc    Delete a product (Admin, soft delete)
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found.' });
        product.isActive = false;
        await product.save();
        res.json({ message: 'Product deactivated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting product.' });
    }
};

// @desc    Delete product image (Admin)
// @route   DELETE /api/admin/products/:id/image/:publicId
// @access  Private/Admin
export const deleteProductImage = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found.' });
        const publicId = String(req.params['publicId']);
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
        product.images = product.images.filter((img) => img.public_id !== publicId) as any;
        await product.save();
        res.json({ images: product.images });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting image.' });
    }
};
