// routes/ProductRoutes.js
import express from 'express';
import * as productController from '../Controllers/productController.js';

const router = express.Router();

router.post('/', productController.create);
router.get('/', productController.getAll);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;
