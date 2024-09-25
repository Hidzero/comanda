import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Header from './header.js';

// Função que retorna a data atual no formato YYYY-MM-DD
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Formata a data para YYYY-MM-DD
};

export default function Caixa() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [startDate, setStartDate] = useState(getTodayDate()); // Data de início, com valor inicial como o dia atual
  const [endDate, setEndDate] = useState(getTodayDate()); // Data de fim, com valor inicial como o dia atual
  const printRefs = useRef({});

  // Função para buscar os pedidos com filtro por data
  const getOrders = async (page, startDate, endDate) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order/filter`, {
        params: {
          page,
          limit: 30,
          startDate: startDate || undefined, // Envia a data apenas se estiver definida
          endDate: endDate || undefined,
        }
      });
      const data = Array.isArray(response.data.data) ? response.data.data : [];

      // Filtra os pedidos com status 'pago'
      const paidOrders = data.filter(order => order.status === 'pago');

      // Verifica se há duplicados antes de adicionar ao estado
      setOrders(prevOrders => {
        const uniqueOrders = paidOrders.filter(newOrder =>
          !prevOrders.some(existingOrder => existingOrder._id === newOrder._id)
        );
        return page === 1 ? uniqueOrders : [...prevOrders, ...uniqueOrders]; // Substitui pedidos ao reiniciar a busca
      });

      setHasMore(paidOrders.length === 30);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      setLoading(false);
    }
  };

  // Faz a requisição ao iniciar a página
  useEffect(() => {
    getOrders(page, startDate, endDate); // Faz a busca já filtrada pela data atual ao carregar
  }, [page, startDate, endDate]);

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2 && hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  const handlePrint = (orderId) => {
    const printContent = printRefs.current[orderId];
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('pt-BR', options);
  };

  // Quando o usuário clica em "Pesquisar", reiniciamos a página e os pedidos
  const handleSearch = () => {
    setPage(1); // Reinicia a paginação para a primeira página
    setOrders([]); // Limpa os pedidos antes da nova pesquisa
    getOrders(1, startDate, endDate); // Faz a busca com a nova data
  };

  // Função para calcular o total de um pedido
  const calculateOrderTotal = (order) => {
    return order.items.reduce((total, item) => total + (item.price || 0), 0); // Soma os preços dos itens
  };

  // Função para calcular o total de todas as comandas
  const calculateTotalAllOrders = () => {
    return orders.reduce((total, order) => total + calculateOrderTotal(order), 0); // Soma os totais de todos os pedidos
  };

  return (
    <div>
      <Header />
      <div className="container">
        <h1>Pedidos</h1>

        {/* Inputs para selecionar as datas */}
        <div className="date-filters">
          <label>
            Data Inicial:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-control"
            />
          </label>
          <label>
            Data Final:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-control"
            />
          </label>
          <label className='d-flex flex-column justify-content-end ms-2'>
            <button onClick={handleSearch} className="btn btn-primary">
              Pesquisar
            </button>
          </label>
        </div>

        {orders.length === 0 && !loading ? (
          <p>Nenhum pedido encontrado.</p>
        ) : (
          <>
            {orders.map((order) => (
              <div key={order._id} className="order-card mb-3">
                <div ref={(el) => (printRefs.current[order._id] = el)}>
                  <h3>Mesa {order.tableNumber} - Pedido #{order.orderNumber} - {formatDate(order.createdAt)}</h3>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.name} - R${item.price ? item.price.toFixed(2) : '0.00'} - {item.observation || 'Sem observação'}
                      </li>
                    ))}
                  </ul>
                  {/* Exibe o total do pedido */}
                  <p><strong>Total do pedido:</strong> R${calculateOrderTotal(order).toFixed(2)}</p>
                </div>
                <button onClick={() => handlePrint(order._id)} className="btn btn-success">
                  Imprimir este pedido
                </button>
              </div>
            ))}
            {/* Exibe o valor total de todas as comandas */}
            <div className="total-all-orders">
              <h3><strong>Total de todas as comandas:</strong> R${calculateTotalAllOrders().toFixed(2)}</h3>
            </div>
          </>
        )}

        {loading && <p>Carregando mais pedidos...</p>}
        {!hasMore && <p>Todos os pedidos foram carregados.</p>}

        <button onClick={() => window.print()} className="btn btn-primary">
          Imprimir todos os pedidos
        </button>
      </div>

      <style jsx='true'>{`
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
      `}</style>
    </div>
  );
}
