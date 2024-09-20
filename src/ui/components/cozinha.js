import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function TelaCozinha() {
  const [orders, setOrders] = useState([]);

  // Função para buscar todos os pedidos pendentes (excluindo bebidas)
  const getOrders = async () => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order`);
      // Filtra os pedidos para exibir apenas os que são alimentos
      const filteredOrders = response.data.filter(order => 
        order.items.some(item => item.category !== 'bebida')
      );
      setOrders(filteredOrders);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="container">
      <h1>Pedidos na Cozinha</h1>
      {orders.length === 0 ? (
        <p>Nenhum pedido pendente.</p>
      ) : (
        orders.map((order) =>
          order.items.map((item, index) => 
            item.category !== 'bebida' && (
              <div key={index} className="order-card">
                <h3>Mesa {order.tableNumber}</h3>
                <p>Pedido: {item.name}</p>
                <p>Observações: {item.observation || 'Nenhuma'}</p>
                <p>Tempo do pedido: {Math.round((new Date() - new Date(item.createdAt)) / 60000)} minutos atrás</p>
              </div>
            )
          )
        )
      )}
    </div>
  );
}
