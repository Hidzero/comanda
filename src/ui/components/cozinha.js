import React, { useEffect, useState } from 'react';
import Header from './header.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function TelaCozinha() {
  const [items, setItems] = useState([]); // Novo estado para armazenar todos os itens
  const navigate = useNavigate();

  // Função para buscar todos os pedidos com status "em preparo"
  const getOrders = async () => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order`);
      const ordersData = response.data.data;

      // Extrai todos os itens das orders e define no estado `items`
      const allItems = ordersData.flatMap(order => 
        order.items.map(item => ({ ...item, tableNumber: order.tableNumber, orderId: order._id }))
      );
      setItems(allItems);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  // Função para marcar um item como entregue e atualizar o estado localmente
  const handleMarkAsDelivered = async (orderId, itemId) => {
    try {
      await axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order/entregue/${orderId}/${itemId}`, {
        status: 'entregue'
      });

      // Atualiza o estado localmente
      setItems((prevItems) =>
        prevItems.map(item =>
          item._id.toString() === itemId.toString() ? { ...item, status: 'entregue' } : item
        )
      );

      navigate('/mesas');
    } catch (error) {
      console.error('Erro ao marcar item como entregue:', error);
    }
  };

  // Atualiza os pedidos inicialmente e a cada 10 segundos
  useEffect(() => {
    getOrders();
    const interval = setInterval(() => {
      getOrders();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const comboName = (name) => {
    if (name === '1 - Panceta/ Torresmo/ Carne Seca/ Linguiça Mineira/ Queijo/ Aipim') {
      return 'Combo 1';
    } else if (name === '2 - Panceta/ Torresmo/ Carne Seca/ Linguica Mineira/ Aipim') {
      return 'Combo 2';
    } else if (name === '3 - Panceta/ Torresmo/ Carne Seca/ Aipim') {
      return 'Combo 3';
    } else if (name === '4 - Panceta/ Carne Seca/ Aipim') {
      return 'Combo 4';
    } else if (name === '5 - Torresmo/ Carne Seca/ Aipim') {
      return 'Combo 5';
    } else if (name === '6 - Panceta/ Torresmo/ Aipim') {
      return 'Combo 6';
    } else if (['Carne seca com aipim', 'Contrá filé com fritas', 'Panceta com aipim', 'Torresmo com aipim', 'Linguiça com aipim', 'Batata frita', 'Porção de aipim', 'Coxinha de frango empanado sem pimenta', 'Coxinha de frango empanado com pimenta', 'Salame', 'Queijo coalho', 'Gurjão de peixe'].includes(name)) {
      return 'Porção Separada';
    } else if (['Meia porção de torresmo', 'Meia porção de panceta', 'Meia porção de carne seca', 'Meia porção de linguiça'].includes(name)) {
      return 'Meia Porção';
    } else if (['Churrasquinho Misto', 'Churrasquinho de Carne'].includes(name)) {
      return 'Churrasco no Palito';
    } else {
      return '';
    }
  };

  return (
    <div>
      <Header />
      <div className="container">
        <h1>Pedidos na Cozinha</h1>
        {items.filter(item => item.status === 'emPreparo').length === 0 ? (
          <p>Nenhum pedido em preparo.</p>
        ) : (
          <div className="orders-grid">
            {items
              .filter(item =>
                item.status === 'emPreparo' &&
                item.category !== 'cerveja' &&
                item.category !== 'refrigerante' &&
                item.category !== 'doses' &&
                item.category !== 'doces' &&
                item.category !== 'sorvetes' &&
                item.category !== 'outros'
              )
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Ordena por 'createdAt'
              .map((item, index) => (
                <div key={index} className="order-card d-flex flex-column">
                  <div className='d-flex flex-column align-items-center'>
                    <h3>Mesa {item.tableNumber}</h3>
                    <hr />
                    <h3 className='text-red'> <strong>{comboName(item.name)}</strong></h3>
                  </div>
                  <p><strong>Pedido:</strong> {item.name}</p>
                  <p><strong>Observações:</strong> {item.observation || 'Nenhuma'}</p>
                  <p><strong>Tempo do pedido:</strong> {Math.round((new Date() - new Date(item.createdAt)) / 60000)} minutos atrás</p>
                  <div className="flex-grow-1"></div>
                  <button
                    className="btn btn-success d-flex justify-content-center hidden"
                    onClick={() => handleMarkAsDelivered(item.orderId, item._id)}
                  >
                    Marcar como Entregue
                  </button>
                </div>
              ))
            }
          </div>
        )}
      </div>
      <style jsx='true'>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .text-red {
          color: red;
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
        @media (max-width: 1200px) {
          .hidden {
            display: none !important;
          } 
        }
      `}</style>
    </div>
  );
}
