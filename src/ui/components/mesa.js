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

  const getOrdersByTableName = async (tableName) => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order/${tableName}`);
      const datas = response.data;

      // Verifica se há pedidos com o status 'emPreparo'
      const activeOrder = datas.data.find(data => data.status === 'emPreparo');

      if (activeOrder) {
        setOrders({
          ...activeOrder,
          items: Array.isArray(activeOrder.items) ? activeOrder.items : []
        });
      } else {
        alert("Nenhum pedido em preparo para essa mesa.");
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
      items: [...prevOrders.items, { ...item, observation: '', createdAt: new Date() }] // Adiciona o timestamp
    }));
  };

  const handleRemoveItem = async (index) => {
    const itemToRemove = orders.items[index];

    // Verifica se o item ainda não foi entregue
    if (itemToRemove.status === 'entregue') {
      alert("Este item já foi entregue e não pode ser removido.");
      return;
    }

    try {
      const orderId = orders._id;
      console.log(orderId);

      // Atualiza o pedido no banco de dados, removendo o item
      const updatedItems = orders.items.filter((_, i) => i !== index);
      console.log(updatedItems);

      await axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order/delete/${orderId}`, {
        items: updatedItems
      });

      // Atualiza o estado local para refletir a remoção do item
      setOrders((prevOrders) => ({
        ...prevOrders,
        items: updatedItems,
        total: prevOrders.total - itemToRemove.price // Subtrai o valor do item removido do total
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
      newItems[index].observation = observation; // Atualiza a observação do item
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
      console.log(orderId);
      console.log(tableNumber);
      await axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order/${orderId}`, {
        status: 'pago'
      });

      await axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/table/${tableNumber}`, {
        status: 'livre'
      });

      // Atualiza o estado local para refletir o status "pago"
      setOrders({
        status: 'pago',
        total: 0,
        items: [],
      });

      alert('Pedido marcado como pago!');
      navigate('/mesas'); // Redireciona para a página das mesas

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

      // Enviar o pedido para a cozinha
      const response = await axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order`, orderData);

      if (response.status === 201) {
        alert("Itens enviados para a cozinha com sucesso!");
      } else if (response.status === 200) {
        alert("Pedido atualizado com sucesso!");
      }

      // Atualizar o status dos itens para "emPreparo" após serem enviados
      setOrders((prevOrders) => ({
        ...prevOrders,
        items: prevOrders.items.map(item => ({
          ...item,
          status: 'emPreparo' // Atualiza o status dos itens que foram enviados
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

    // Atualizar o status dos itens para "emPreparo" após serem enviados
    setOrders((prevOrders) => ({
      ...prevOrders,
      items: prevOrders.items.map(item => ({
        ...item,
        status: 'emPreparo' // Atualiza o status dos itens que foram enviados
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

                    {/* Botão para excluir o item */}
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveItem(index)}
                    >
                      Excluir
                    </button>
                  </div>

                  {/* Campo para adicionar observação ao item */}
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


          <button onClick={sendToKitchen} className="btn btn-primary m-3">
            Enviar pedido
          </button>

          <button onClick={updateKitchen} className="btn btn-primary m-3">
            Atualizar pedido
          </button>

          <button onClick={closeOrder} className="btn btn-primary m-3">
            Fechar Comanda
          </button>

          <button onClick={markAsPaid} className="btn btn-primary m-3">
            Marcar como Pago
          </button>
        </div>
      </div>
    </div>
  );
}