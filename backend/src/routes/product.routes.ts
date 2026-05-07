import { Router } from 'express';
import multer from 'multer';
import { protect, admin } from '../middlewares/auth.middleware';
import { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct, deleteProductImage } from '../controllers/product.controller';

const storage = multer.diskStorage({ destination: 'uploads/', filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`) });
const upload = multer({ storage });

const router = Router();

// Public
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Admin
router.post('/', protect, admin, upload.array('images', 10), createProduct);
router.put('/:id', protect, admin, upload.array('images', 10), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.delete('/:id/image/:publicId', protect, admin, deleteProductImage);

export default router;
