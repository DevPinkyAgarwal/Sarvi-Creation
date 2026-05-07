import { Router } from 'express';
import multer from 'multer';
import { protect, admin } from '../middlewares/auth.middleware';
import { getCategories, createCategory, updateCategory, deleteCategory, updateCategoryProducts } from '../controllers/category.controller';

const storage = multer.diskStorage({ destination: 'uploads/', filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`) });
const upload = multer({ storage });

const router = Router();

router.get('/', getCategories);
router.post('/', protect, admin, upload.single('image'), createCategory);
router.put('/:id', protect, admin, upload.single('image'), updateCategory);
router.put('/:id/products', protect, admin, updateCategoryProducts);
router.delete('/:id', protect, admin, deleteCategory);

export default router;
