import OrderRepository from "../Repositories/orderRepository.js";

// orderController.js
export async function createOrder(req, res) {
    try {
        const { tableNumber, items } = req.body;
  
      if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Nenhum item para processar' });
      }
  
      const orderNumber = await OrderRepository.generateOrderNumber();
      const newOrder = await OrderRepository.create({
        tableNumber,
        orderNumber,
        items
      });
      
      res.status(201).json({
        statusCode: 201,
        message: "Pedido criado com sucesso",
        data: newOrder
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  

export async function getOrderByTableId(req, res) {
    try {
        const orders = await OrderRepository.findByTableId(req.params.tableId);
        res.status(200).json({
            statusCode: 200,
            message: "Pedidos da mesa",
            data: orders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function updateOrder(req, res) {
    try {
        const updatedOrder = await OrderRepository.updateById(req.params.id, req.body);
        res.status(200).json({
            statusCode: 200,
            message: "Pedido atualizado",
            data: updatedOrder
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function deleteOrder(req, res) {
    try {
        await OrderRepository.deleteById(req.params.id);
        res.status(200).json({
            statusCode: 200,
            message: "Pedido deletado"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
