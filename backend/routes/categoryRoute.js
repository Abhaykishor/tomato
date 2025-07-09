import express from 'express';
import { addCategory, listCategories, editCategory, deleteCategory, reorderCategories } from '../controllers/categoryController.js';
import multer from 'multer';
const categoryRouter = express.Router();

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        return cb(null,`${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

categoryRouter.get('/list', listCategories);
categoryRouter.post('/add', upload.single('image'), addCategory);
categoryRouter.post('/edit', upload.single('image'), editCategory);
categoryRouter.post('/delete', deleteCategory);
categoryRouter.post('/reorder', reorderCategories);

export default categoryRouter; 