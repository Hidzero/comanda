import orderRepository from "../Repositories/orderRepository.js";
import OrderRepository from "../Repositories/orderRepository.js";
import TableRepository from '../Repositories/tableRepository.js'; // Presumindo que você tenha um repositório para mesas

export async function createOrder(req, res) {
  try {
    const { tableNumber, items } = req.body;

    const orderNumber = await orderRepository.generateOrderNumber();

    const newOrder = await OrderRepository.create({
      tableNumber,
      orderNumber: orderNumber,
      items,
      status: 'emPreparo'
    });

    // Atualiza o status da mesa para "ocupada"
    await TableRepository.updateStatusByTableNumber(tableNumber, 'ocupada');

    res.status(201).json({
      statusCode: 201,
      message: "Pedido criado com sucesso",
      data: newOrder
    });

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

export async function getOrdersByFilter(req, res) {
  try {
    const { startDate, endDate, page = 1, limit = 30 } = req.query;

    // Criar um filtro básico de data
    const dateFilter = {};
    if (startDate) {
      dateFilter.createdAt = { $gte: new Date(startDate) }; // Filtra a partir da data inicial
    }
    if (endDate) {
      if (!dateFilter.createdAt) dateFilter.createdAt = {};
      dateFilter.createdAt.$lte = new Date(new Date(endDate).setHours(23, 59, 59, 999)); // Filtra até o final do dia
    }

    // Buscar os pedidos no banco com base no filtro de data e paginação
    const orders = await OrderRepository.findByFilter(dateFilter, page, limit);

    res.status(200).json({
      statusCode: 200,
      message: 'Pedidos encontrados',
      data: orders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getOrderByTableId(req, res) {
  try {
    const orders = await OrderRepository.findByTableIdAndStatus(req.params.tableId, 'emPreparo');

    if (orders.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: "Nenhum pedido em preparo para essa mesa."
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Pedidos em preparo",
      data: orders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export async function updateItemStatus(req, res) {
  try {
    const { orderId, itemId } = req.params;
    const status = req.body;

    const res = await OrderRepository.updateItemStatus(orderId, itemId, status);

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
    const data = {
      items: req.body
    }
    const updatedOrder = await OrderRepository.updateById(req.params.orderId, data);

    res.status(200).json({
      statusCode: 200,
      message: "Pedido atualizado",
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const updatedOrder = await OrderRepository.updateById(req.params.id, req.body);

    res.status(200).json({
      statusCode: 200,
      message: "Status do pedido atualizado",
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function markAsDelivered(req, res) {
  try {
    // O `itemId` é o ID do item que você quer atualizar no array `items`
    const { orderId, itemId } = req.params;
    
    // Atualiza o status do item no array `items`
    const updatedOrder = await OrderRepository.updateItemStatus(orderId, itemId, req.body.status);

    res.status(200).json({
      statusCode: 200,
      message: "Pedido entregue",
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

export async function removeItemFromOrder(req, res) {
  try {
    const orderId  = req.params.id;
    const { items } = req.body;

    const updatedOrder = await orderRepository.updateById(orderId, { items }, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Item removido com sucesso',
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
