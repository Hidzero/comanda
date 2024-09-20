import Order from '../Models/Order.js';

class OrderRepository {
    async create(orderData) {
        const order = new Order(orderData);
        await order.save();
        return order;
    }

    async findByTableNumberAndStatus(tableNumber, status) {
        return await Order.findOne({ tableNumber, status });
      }      

    async generateOrderNumber(){
        const lastOrder = await Order.findOne().sort({ orderNumber: -1 }); 
        if (!lastOrder)
            return 1;
        else
            return lastOrder ? lastOrder.orderNumber + 1 : 1;
    };

    async findAll() {
        return await Order.find();
    }

    async findByTableId(tableId) {
        return await Order.find({ tableNumber: tableId  });
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