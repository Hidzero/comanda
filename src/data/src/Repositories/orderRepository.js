import Order from '../Models/Order.js';

class OrderRepository {
    async create(orderData) {
        const order = new Order(orderData);
        await order.save();
        return order;
    }

    async generateOrderNumber(){
        const lastOrder = await Order.findOne().sort({ orderNumber: -1 }); 
        if (!lastOrder)
            return 1;
        else
            return lastOrder ? lastOrder.orderNumber + 1 : 1;
    };

    async findByTableId(tableId) {
        return await Order.find({ tableId });
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