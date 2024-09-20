import express from 'express';
import * as OrderController from '../Controllers/orderController.js';

const router = express.Router();

router.post('/', OrderController.createOrder);
router.get('/:tableId', OrderController.getOrderByTableId);
router.put('/:id', OrderController.updateOrder);
router.delete('/:id', OrderController.deleteOrder);

export default router;
