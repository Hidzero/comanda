import Order from '../Models/Order.js';

class OrderRepository {
    async create(orderData) {
        const order = new Order(orderData);
        try {
            await order.save();
            return order;
        } catch (error) {
            return error;
        }
    }

    async findByTableNumberAndStatus(tableNumber, status) {
        return await Order.findOne({ tableNumber, status });
    }

    async findWithPendingItems() {
        return await Order.find({ status: 'emPreparo' });
    }

    async generateOrderNumber() {
        const lastOrder = await Order.findOne().sort({ orderNumber: -1 });
        if (!lastOrder)
            return 1;
        else
            return lastOrder ? lastOrder.orderNumber + 1 : 1;
    };

    async findByTableIdAndStatus(tableId, status) {
        return await Order.find({ tableNumber: tableId, status: status });
    }

    async updateItemStatus(orderId, itemId, status) {
        try {
            // Atualiza apenas o campo `status` do item com `_id` igual a `itemId` no array `items`
            const updatedOrder = await Order.findOneAndUpdate(
                { _id: orderId, "items._id": itemId },  // Encontra o pedido e o item no array
                { $set: { "items.$.status": status } }, // Atualiza apenas o status do item
                { new: true }  // Retorna o documento atualizado
            );

            return updatedOrder;
        } catch (error) {
            throw new Error(error.message);
        }
    }


    async findAll() {
        return await Order.find();
    }

    async findByFilter(dateFilter, page, limit) {
        return await Order.find(dateFilter)
        .skip((page - 1) * limit)
        .limit(Number(limit));
    }

    async findByTableId(tableId) {
        return await Order.find({ tableNumber: tableId });
    }

    async findById(id) {
        return await Order.findById(id);
    }

    async updateById(id, orderData) {
        return await Order.findByIdAndUpdate(id, orderData, { new: true });
    }

    async deleteById(id) {
        return await Order.findByIdAndDelete(id);
    }
}

const orderRepository = new OrderRepository();
export default orderRepository;