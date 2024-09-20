import { useParams, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Header from './header.js';
import Cardapio from './cardapio.js';
import axios from 'axios';

export default function Mesa() {
  const { id } = useParams(); // Número da mesa
  const navigate = useNavigate(); // Navegação
  const [orders, setOrders] = useState({
    status: 'emAtendimento',
    total: 0,
    items: []
  });

  // Função para adicionar um item ao pedido
  const handleAddItem = async (item) => {
    setOrders((prevOrders) => ({
      ...prevOrders,
      total: prevOrders.total + item.price,
      items: [...prevOrders.items, { ...item, observation: '', createdAt: new Date() }] // Adiciona timestamp
    }));

    try {
      
      await axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order`, {
        tableNumber: id, // Número da mesa
        items: [{ ...item, observation: '', createdAt: new Date(), category: item.category }]  // Categoria e observações
      });

    } catch (error) {
      console.error('Erro ao enviar o pedido:', error);
    }
  };

  // Função para remover um item do pedido
  const handleRemoveItem = (index) => {
    setOrders((prevOrders) => {
      const newItems = [...prevOrders.items];
      const removedItem = newItems.splice(index, 1); // Remove o item da lista
      return {
        ...prevOrders,
        total: prevOrders.total - removedItem[0].price, // Subtrai o preço do item removido
        items: newItems
      };
    });
  };

  // Função para atualizar a observação de um item
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

  // Função para fechar a comanda
  const closeOrder = () => {
    setOrders((prevOrders) => ({
      ...prevOrders,
      status: 'aguardandoPagamento',
    }));
  };

  // Função para marcar como pago
  const markAsPaid = () => {
    // Reseta o pedido e volta para a página das mesas
    setOrders({
      status: 'pago',
      total: 0,
      items: [],
    });
    navigate('/mesas'); // Redireciona para a tela das mesas
  };

// Função para enviar os itens de comida para a cozinha
const sendToKitchen = async () => {
  try {
    const foodItems = orders.items.filter(item => item.category !== 'bebida'); // Filtra apenas os alimentos

    // Verifica se há itens de comida a serem enviados
    if (foodItems.length === 0) {
      alert("Não há itens de comida para enviar.");
      return;
    }

    // Prepara o pedido a ser enviado
    const orderData = {
      tableNumber: id,
      items: foodItems.map(item => ({
        name: item.name,
        price: item.price,
        category: item.category,
        observation: item.observation,
        createdAt: item.createdAt
      }))
    };

    // Faz a requisição para enviar o pedido
    const response = await axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order`, orderData);

    if (response.status === 201) {
      alert("Itens enviados para a cozinha com sucesso!");
    } else {
      alert("Erro ao enviar os itens para a cozinha.");
    }
  } catch (error) {
    console.error('Erro ao enviar para a cozinha:', error);
    alert("Erro ao enviar os itens para a cozinha.");
  }
};


  return (
    <div>
      <Header />
      <div className="container">
        <div>
          <h1>Mesa {id}</h1>
          <p>Total: R${orders.total.toFixed(2)}</p>
          <h5>Itens do Cardápio:</h5>
          <Cardapio handleAddItem={handleAddItem} />

          <h5>Itens no Pedido:</h5>
          <ul>
            {orders.items.map((item, index) => (
              <li key={index} className="order-item mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span>{item.name} - R${item.price.toFixed(2)}</span>
                  
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

          {/* Botão para enviar os alimentos para a cozinha */}
          <button onClick={sendToKitchen} className="btn btn-primary w-100 mt-3">
            Enviar para a Cozinha
          </button>

          {/* Botão para fechar a comanda */}
          {orders.status === 'emAtendimento' && (
            <button onClick={closeOrder} className="btn btn-custom w-100">
              Fechar Comanda
            </button>
          )}

          {/* Botão para marcar como pago */}
          {orders.status === 'aguardandoPagamento' && (
            <button onClick={markAsPaid} className="btn btn-success w-100">
              Marcar como Pago
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
