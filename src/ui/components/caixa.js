import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './header.js';
import { useNavigate } from 'react-router-dom';

// Função que retorna a data atual no formato YYYY-MM-DD
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Formata a data para YYYY-MM-DD
};

export default function Caixa() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(getTodayDate()); // Data de início
  const [endDate, setEndDate] = useState(getTodayDate()); // Data de fim
  const [filterDates, setFilterDates] = useState({ startDate: getTodayDate(), endDate: getTodayDate() }); // Estado para armazenar as datas de filtro
  const navigate = useNavigate();

  // Função para buscar todos os pedidos sem limite
  const getOrders = async (startDate, endDate) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order/filter`, {
        params: {
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        }
      });
      const data = Array.isArray(response.data.data) ? response.data.data : [];

      const paidOrders = data.filter(order => order.status === 'pago');
      setOrders(paidOrders);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      setLoading(false);
    }
  };

  // Faz a requisição ao iniciar a página
  useEffect(() => {
    getOrders(filterDates.startDate, filterDates.endDate); // Usa as datas de filtro ao carregar
  }, [filterDates]);

  const handlePrintAllOrders = () => {
    navigate('/impressao-todos-pedidos', { state: { orders } }); // Redireciona para ImpressaoTodosPedidos com todos os pedidos
  };

  const handlePrint = (order) => {
    navigate('/impressao-caixa', { state: { order } }); // Redireciona para ImpressaoCaixa com um pedido
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('pt-BR', options);
  };

  const handleSearch = () => {
    setOrders([]); // Limpa os pedidos antes da nova pesquisa
    setFilterDates({ startDate, endDate }); // Atualiza as datas de filtro com os valores atuais
  };

  useEffect(() => {
    handleSearch();
  }, [startDate, endDate]); // Adiciona handleSearch às dependências
  

  const calculateOrderTotal = (order) => {
    return order.items.reduce((total, item) => total + (item.price || 0), 0);
  };

  const calculateTotalAllOrders = () => {
    return orders.reduce((total, order) => total + calculateOrderTotal(order), 0);
  };

  return (
    <div>
      <Header />
      <div className="container">
        <h1>Pedidos</h1>

        <div className="row align-items-end mb-3">
          <div className="col-auto">
            <label className="form-label">
              Data Inicial:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-control"
              />
            </label>
          </div>
          <div className="col-auto">
            <label className="form-label">
              Data Final:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="form-control"
              />
            </label>
          </div>

          {/* Botão para imprimir todos os pedidos */}
          <div className="col text-end">
            <button onClick={handlePrintAllOrders} className="btn btn-primary">
              Imprimir todos os pedidos do dia
            </button>
          </div>
        </div>
        <hr />
        <div className="total-all-orders">
          <h3><strong>Total de todas as comandas:</strong> R${calculateTotalAllOrders().toFixed(2)}</h3>
        </div>
        <hr />



        {orders.length === 0 && !loading ? (
          <p>Nenhum pedido encontrado.</p>
        ) : (
          <>
            {orders.map((order) => (
              <div key={order._id} className="order-card mb-3">
                <div>
                  <h3>Mesa {order.tableNumber} - Pedido #{order.orderNumber} - {formatDate(order.createdAt)}</h3>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.name} - R${item.price ? item.price.toFixed(2) : '0.00'} - {item.observation || 'Sem observação'}
                      </li>
                    ))}
                  </ul>
                  <p><strong>Total do pedido:</strong> R${calculateOrderTotal(order).toFixed(2)}</p>
                </div>
                <button onClick={() => handlePrint(order)} className="btn btn-success">
                  Imprimir este pedido
                </button>
              </div>
            ))}
          </>
        )}

        {loading && <p>Carregando mais pedidos...</p>}

        {/* Botão para imprimir todos os pedidos */}

      </div>

      {/* Estilização restaurada */}
      <style jsx="true">{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .date-filters {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .form-control {
          margin-left: 10px;
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

        .order-card ul {
          padding-left: 20px;
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

        .total-all-orders {
          margin-top: 20px;
          font-size: 1.5rem;
        }

        .btn-primary {
          padding: 10px;
          background-color: blue;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 20px;
        }

        .btn-primary:hover {
          background-color: darkblue;
        }
      `}</style>
    </div>
  );
}
