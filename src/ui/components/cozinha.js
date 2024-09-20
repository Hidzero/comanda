import React, { useEffect, useState } from 'react';
import Header from './header.js';
import axios from 'axios';

export default function TelaCozinha() {
  const [orders, setOrders] = useState([]);

  // Função para buscar todos os pedidos com status "em preparo"
  const getOrders = async () => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order`);
      setOrders(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  // Função para marcar um item como entregue
  const handleMarkAsDelivered = async (orderId, itemId) => {
    try {
      console.log('orderId:', orderId);
      console.log('itemId:', itemId);
      await axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order/${orderId}/items/${itemId}/status`, {
        items: [{status: 'entregue'}]
      });
      // Atualiza a lista de pedidos ao marcar um item como entregue
      getOrders();
    } catch (error) {
      console.error('Erro ao marcar como entregue:', error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const hasPendingItems = orders.some(order =>
    order.items.some(item => item.status === 'pendente')
  );

  return (
    <div>
      <Header />
      <div className="container">
        <h1>Pedidos na Cozinha</h1>
        {!hasPendingItems ? (
          <p>Nenhum pedido em preparo.</p>
        ) : (
          <div className="orders-grid">
            {orders.map((order) =>
              order.items
                // Filtra apenas itens que estão com o status "pendente"
                .filter(item => item.status === 'pendente' && item.category !== 'nao alcoolico' && item.category !== 'cerveja 600ml' && item.category !== 'long neck' && item.category !== 'drinks prontos')
                .map((item, index) => (
                  <div key={index} className="order-card">
                    <h3>Mesa {order.tableNumber}</h3>
                    <p><strong>Pedido:</strong> {item.name}</p>
                    <p><strong>Observações:</strong> {item.observation || 'Nenhuma'}</p>
                    <p><strong>Tempo do pedido:</strong> {Math.round((new Date() - new Date(item.createdAt)) / 60000)} minutos atrás</p>
                    <button
                      className="btn btn-success"
                      onClick={() => handleMarkAsDelivered(order._id, item._id)}
                    >
                      Marcar como Entregue
                    </button>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
      <style jsx='true'>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .order-card {
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease-in-out;
        }

        .order-card:hover {
          transform: translateY(-5px);
        }

        .order-card h3 {
          font-size: 1.5rem;
          margin-bottom: 10px;
        }

        .order-card p {
          margin-bottom: 10px;
          font-size: 1rem;
        }

        .order-card strong {
          font-weight: 600;
        }

        .btn-success {
          padding: 10px;
          background-color: green;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-success:hover {
          background-color: darkgreen;
        }

        `}</style>
    </div>
  );
}
