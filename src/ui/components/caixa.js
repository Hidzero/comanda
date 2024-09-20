import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Caixa() {
  const [orders, setOrders] = useState([]);

  // Função para buscar todos os pedidos do dia
  const getOrders = async () => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order`);
      setOrders(response.data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="container">
      <h1>Pedidos do Dia</h1>
      {orders.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-summary">
            <h3>Mesa {order.tableNumber} - Pedido #{order.orderNumber}</h3>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.name} - R${item.price.toFixed(2)} - {item.observation || 'Sem observação'}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      <button onClick={() => window.print()} className="btn btn-primary">
        Imprimir
      </button>
    </div>
  );
}
