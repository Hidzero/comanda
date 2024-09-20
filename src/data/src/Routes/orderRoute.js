import express from 'express';
import * as OrderController from '../Controllers/orderController.js';

const router = express.Router();

router.post('/', OrderController.createOrUpdateOrder);
router.get('/', OrderController.getOrders);
router.get('/:tableId', OrderController.getOrderByTableId);
router.put('/:orderId/items/:itemId/status', OrderController.updateItemStatus);
router.put('/:id', OrderController.updateOrder);
router.delete('/:id', OrderController.deleteOrder);

export default router;
