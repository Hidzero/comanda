import OrderRepository from "../Repositories/orderRepository.js";
import TableRepository from '../Repositories/tableRepository.js'; // Presumindo que você tenha um repositório para mesas

export async function createOrUpdateOrder(req, res) {
  try {
    const { tableNumber, items } = req.body;

    // Verifica se já existe um pedido em aberto para a mesa
    let existingOrder = await OrderRepository.findByTableNumberAndStatus(tableNumber, 'emPreparo');

    if (existingOrder) {
      // Adiciona apenas os novos itens, sem duplicar os existentes
      const newItems = items.filter(newItem => {
        return !existingOrder.items.some(existingItem =>
          existingItem.name === newItem.name &&
          existingItem.price === newItem.price &&
          existingItem.category === newItem.category &&
          existingItem.observation === newItem.observation
        );
      });

      await TableRepository.updateStatusByTableNumber(tableNumber, 'ocupada');

      // Atualiza o pedido existente com novos itens
      existingOrder.items = [...existingOrder.items, ...newItems];
      existingOrder = await OrderRepository.updateById(existingOrder._id, existingOrder);

      console.log('Pedido atualizado:', existingOrder);

      res.status(200).json({
        statusCode: 200,
        message: "Pedido atualizado com sucesso",
        data: existingOrder
      });
    } else {
      // Cria um novo pedido
      const orderNumber = await OrderRepository.generateOrderNumber();

      const newOrder = await OrderRepository.create({
        tableNumber,
        orderNumber,
        items,
        status: 'emPreparo'  // Define o status inicial como "em preparo"
      });

      // Atualiza o status da mesa para "ocupada"
        await TableRepository.updateStatusByTableNumber(tableNumber, 'ocupada');

      res.status(201).json({
        statusCode: 201,
        message: "Pedido criado com sucesso",
        data: newOrder
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

  export async function getOrders(req, res) {
    try {
        const orders = await OrderRepository.findAll();
        res.status(200).json({
            statusCode: 200,
            message: "Pedidos",
            data: orders
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

export async function updateItemStatus(req, res) {
    try {
      const { orderId, itemId } = req.params;
      const status = req.body.items[0].status;
  
      // Busca o pedido pelo ID
      const order = await OrderRepository.findById(orderId);
      
  
      if (!order) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }
  
      // Atualiza o status do item
      const itemIndex = order.items.findIndex(item => item._id.toString() === itemId);

  
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item não encontrado no pedido' });
      }
  
      order.items[itemIndex].status = status; // Atualiza o status do item
      await order.save(); // Salva a alteração no banco
  
      res.status(200).json({
        statusCode: 200,
        message: 'Status do item atualizado com sucesso',
        data: order
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
