import express from 'express';
import * as OrderController from '../Controllers/orderController.js';

const router = express.Router();

router.post('/', OrderController.createOrder);
router.get('/', OrderController.getOrders);
router.get('/filter', OrderController.getOrdersByFilter);
router.get('/:tableId', OrderController.getOrderByTableId);
router.put('/update/:orderId', OrderController.updateOrder);
router.put('/:id', OrderController.updateOrderStatus);
router.put('/entregue/:orderId/:itemId', OrderController.markAsDelivered);
router.put('/delete/:id', OrderController.removeItemFromOrder);
router.put('/delete/:id', OrderController.removeItemFromOrder);

export default router;