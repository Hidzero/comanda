import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Cardapio from './cardapio.js';
import axios from 'axios';
import Header from './header.js';

export default function Mesa() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState({
    status: 'emAtendimento',
    total: 0,
    items: []
  });

  // Função para buscar o pedido por mesa
  const getOrdersByTableName = async (tableName) => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order/${tableName}`);
      const datas = response.data;

      // Verifica se há pedidos com status 'emPreparo' ou 'aguardandoPagamento'
      const activeOrder = datas.data.find(data => data.status === 'emPreparo' || data.status === 'aguardandoPagamento');

      if (activeOrder) {
        setOrders({
          ...activeOrder,
          items: Array.isArray(activeOrder.items) ? activeOrder.items : []
        });
      } else {
        // Caso não haja pedido no banco, reseta os pedidos
        setOrders({ status: 'emAtendimento', total: 0, items: [] });
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  useEffect(() => {
    getOrdersByTableName(id);
  }, [id]);

  const handleAddItem = (item) => {
    setOrders((prevOrders) => ({
      ...prevOrders,
      total: prevOrders.total + (item.price || '0.00'),
      items: [...prevOrders.items, { ...item, observation: '', createdAt: new Date() }]
    }));
  };

  const handleRemoveItem = async (index) => {
    const itemToRemove = orders.items[index];

    if (itemToRemove.status === 'entregue') {
      alert("Este item já foi entregue e não pode ser removido.");
      return;
    }

    try {
      const orderId = orders._id;
      const updatedItems = orders.items.filter((_, i) => i !== index);

      await axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order/delete/${orderId}`, {
        items: updatedItems
      });

      setOrders((prevOrders) => ({
        ...prevOrders,
        items: updatedItems,
        total: prevOrders.total - itemToRemove.price
      }));

      alert("Item removido com sucesso!");

    } catch (error) {
      console.error('Erro ao remover item:', error);
      alert('Erro ao remover item.');
    }
  };

  const handleUpdateObservation = (index, observation) => {
    setOrders((prevOrders) => {
      const newItems = [...prevOrders.items];
      newItems[index].observation = observation;
      return {
        ...prevOrders,
        items: newItems
      };
    });
  };

  const closeOrder = () => {
    setOrders((prevOrders) => ({
      ...prevOrders,
      status: 'aguardandoPagamento',
    }));
  };

  const markAsPaid = async () => {
    try {
      const orderId = orders._id;
      const tableNumber = orders.tableNumber;

      await axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order/${orderId}`, {
        status: 'pago'
      });

      await axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/table/${tableNumber}`, {
        status: 'livre'
      });

      setOrders({
        status: 'pago',
        total: 0,
        items: [],
      });

      alert('Pedido marcado como pago!');
      navigate('/mesas');

    } catch (error) {
      console.error('Erro ao marcar o pedido como pago:', error);
      alert('Erro ao marcar o pedido como pago.');
    }
  };

  const sendToKitchen = async () => {
    try {
      const foodItems = orders.items;

      const orderData = {
        tableNumber: id,
        items: foodItems.map(item => ({
          name: item.name,
          price: item.price,
          category: item.category,
          observation: item.observation,
          createdAt: item.createdAt,
          status: item.status
        }))
      };

      const response = await axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order`, orderData);

      if (response.status === 201) {
        alert("Itens enviados para a cozinha com sucesso!");
      } else if (response.status === 200) {
        alert("Pedido atualizado com sucesso!");
      }

      setOrders((prevOrders) => ({
        ...prevOrders,
        items: prevOrders.items.map(item => ({
          ...item,
          status: 'emPreparo'
        }))
      }));
      navigate('/mesas');

    } catch (error) {
      console.error('Erro ao enviar para a cozinha ou marcar mesa como ocupada:', error);
      alert("Erro ao enviar os itens para a cozinha ou marcar a mesa como ocupada.");
    }
  };

  const updateKitchen = async () => {
    const foodItems = orders.items;
    const orderData = {
      items: [...foodItems]
    };

    const response = await axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order/update/${orders._id}`, orderData.items);

    if (response.status === 201) {
      alert("Itens enviados para a cozinha com sucesso!");
    } else if (response.status === 200) {
      alert("Pedido atualizado com sucesso!");
    }

    setOrders((prevOrders) => ({
      ...prevOrders,
      items: prevOrders.items.map(item => ({
        ...item,
        status: 'emPreparo'
      }))
    }));
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div>
          <h1>Mesa {id}</h1>
          <p>Total: R${orders.total ? orders.total.toFixed(2) : '0.00'}</p>
          <h5>Itens do Cardápio:</h5>
          <Cardapio handleAddItem={handleAddItem} />

          <h5>Itens no Pedido:</h5>
          {orders.items && orders.items.length > 0 ? (
            <ul>
              {orders.items.map((item, index) => (
                <li key={index} className="order-item mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>
                      {item.name} - R${item.price ? item.price.toFixed(2) : '0.00'}
                      {!(item.category === 'nao alcoolico' || item.category === 'drinks prontos' || item.category === 'cerveja 600ml' || item.category === 'long neck') && (
                        <> - Status: {item.status}</>
                      )}
                    </span>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveItem(index)}
                    >
                      Excluir
                    </button>
                  </div>

                  <textarea
                    className="form-control mt-2"
                    value={item.observation}
                    onChange={(e) => handleUpdateObservation(index, e.target.value)}
                    placeholder="Adicione uma observação ao item (ex: sem sal, extra queijo)"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum item no pedido em preparo.</p>
          )}

          {/* Condiciona a exibição dos botões com base no estado do pedido */}
          {(!orders._id || orders.status === 'emAtendimento') && (
            <button onClick={sendToKitchen} className="btn btn-primary m-3">
              Enviar pedido
            </button>
          )}

          {orders._id && orders.status === 'emPreparo' && (
            <>
              <button onClick={updateKitchen} className="btn btn-primary m-3">
                Atualizar pedido
              </button>
              <button onClick={closeOrder} className="btn btn-primary m-3">
                Fechar Comanda
              </button>
            </>
          )}

          {orders.status === 'aguardandoPagamento' && (
            <>
              <button onClick={updateKitchen} className="btn btn-primary m-3">
                Atualizar pedido
              </button>
              <button onClick={markAsPaid} className="btn btn-primary m-3">
                Marcar como Pago
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
