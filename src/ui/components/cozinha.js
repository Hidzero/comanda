import React, { useEffect, useState } from 'react';
import Header from './header.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function TelaCozinha() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate(); // Navegação


  // Função para buscar todos os pedidos com status "em preparo"
  const getOrders = async () => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order`);
      setOrders(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

// Função para marcar um item como entregue e atualizar o estado localmente
const handleMarkAsDelivered = async (orderId, itemId) => {
  try {
    // Atualiza o status no banco de dados
    await axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order/entregue/${orderId}/${itemId}`, {
      status: 'entregue'
    });

    // Atualiza o estado localmente sem precisar fazer uma nova requisição
    setOrders((prevOrders) => {
      return prevOrders.map(order => {
        if (order._id.toString() === orderId.toString()) {
          return {
            ...order,
            items: order.items.map(item =>
              item._id.toString() === itemId.toString() 
                ? { ...item, status: 'entregue' } // Atualiza apenas o status
                : item
            )
          };
        }
        return order; // Retorna o pedido sem alterações
      });
    });

    // Navega para a página de mesas após atualizar o pedido
    navigate('/mesas');

  } catch (error) {
    console.error('Erro ao marcar item como entregue:', error);
  }
};


  useEffect(() => {
    getOrders();
  }, []);

  const hasPendingItems = Array.isArray(orders) && orders.some(order =>
    Array.isArray(order.items) && order.items.some(item => item.status === 'emPreparo')
  );


  const comboName = (name) => {
    if (name === 'Panceta/ Torresmo/ Carne Seca/ Linguiça Mineira/ Queijo/ Aipim') {
      return 'Combo 1'
    }
    else if (name === 'Panceta/ Torresmo/ Carne Seca/ Linguica Mineira/ Aipim') {
      return 'Combo 2'
    }
    else if (name === 'Panceta/ Torresmo/ Carne Seca/ Aipim') {
      return 'Combo 3'
    }
    else if (name === 'Panceta/ Carne Seca/ Aipim') {
      return 'Combo 4'
    }
    else if (name === 'Torresmo/ Carne Seca/ Aipim') {
      return 'Combo 5'
    }
    else if (name === 'Panceta/ Torresmo/ Aipim') {
      return 'Combo 6'
    }
    else {
      return ''
    }
  };

  return (
    <div>
      <Header />
      <div className="container">
        <h1>Pedidos na Cozinha</h1>
        {!hasPendingItems ? (
          <p>Nenhum pedido em preparo.</p>
        ) : (
          <div className="orders-grid">
            {Array.isArray(orders) && orders.map((order) =>
              Array.isArray(order.items) && order.items
                .filter(item =>
                  item.status === 'emPreparo' &&
                  item.category !== 'nao alcoolico' &&
                  item.category !== 'cerveja 600ml' &&
                  item.category !== 'long neck' &&
                  item.category !== 'drinks prontos'
                )
                .map((item, index) => (
                  <div key={index} className="order-card d-flex flex-column">
                    <div className='d-flex flex-column align-items-center'>
                      <h3>Mesa {order.tableNumber}</h3>
                      <hr />
                      <h3 className='text-red'> <strong>{comboName(item.name)}</strong></h3>
                    </div>
                    <p><strong>Pedido:</strong> {item.name}</p>
                    <p><strong>Observações:</strong> {item.observation || 'Nenhuma'}</p>
                    <p><strong>Tempo do pedido:</strong> {Math.round((new Date() - new Date(item.createdAt)) / 60000)} minutos atrás</p>
                    <div className="flex-grow-1"></div>
                    <button
                      className="btn btn-success d-flex justify-content-center"
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

      `}</style>
    </div>
  );
}
