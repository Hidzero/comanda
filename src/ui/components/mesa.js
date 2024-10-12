import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
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

  const [showModal, setShowModal] = useState(false);
  const [isDividing] = useState(true);
  const [numPeople, setNumPeople] = useState(1);
  const [paymentMethods, setPaymentMethods] = useState(["dinheiro"]); // Inicializa com "dinheiro" como padrão
  const [searchTerm, setSearchTerm] = useState(""); // Estado para o filtro de pesquisa
  const totalPerPerson = orders.total / numPeople;

  const printRef = useRef(); // Referência para o conteúdo a ser impresso

  const getOrdersByTableName = async (tableName) => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order/${tableName}`);
      const datas = response.data;

      const activeOrder = datas.data.find(data => data.status === 'emPreparo' || data.status === 'aguardandoPagamento');

      if (activeOrder) {
        const total = activeOrder.items.reduce((acc, item) => acc + (item.price || 0), 0);
        setOrders({
          ...activeOrder,
          total,
          items: Array.isArray(activeOrder.items) ? activeOrder.items : []
        });
      } else {
        setOrders({ status: 'emAtendimento', total: 0, items: [] });
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  useEffect(() => {
    getOrdersByTableName(id);
  }, [id]);

  const handlePrint = () => {
    const groupedItems = orders.items.map(item => {
      const duplicates = orders.items.filter(i => i.name === item.name && i.price === item.price);
      return {
        name: item.name,
        price: item.price,
        observation: item.observation,
        quantity: duplicates.length
      };
    });

    const uniqueItems = groupedItems.filter(
      (item, index, self) => index === self.findIndex((i) => i.name === item.name && i.price === item.price)
    );

    navigate('/impressao', {
      state: {
        items: uniqueItems,
        tableNumber: orders.tableNumber, // Número da mesa
        orderNumber: orders.orderNumber  // Número do pedido
      }
    });
  };


  const handleAddItem = (item) => {
    const categoriesWithDescription = ['cerveja', 'refrigerante', 'doses', 'doces', 'sorvetes', 'outros'];

    setOrders((prevOrders) => ({
      ...prevOrders,
      total: prevOrders.total + (item.price || 0),
      items: [
        ...prevOrders.items,
        {
          ...item,
          observation: categoriesWithDescription.includes(item.category) ? item.description : '',
          createdAt: new Date()
        }
      ]
    }));
  };

  const handleRemoveItem = async (index, isGrouped, itemName) => {
    if (isGrouped) {
      const groupedIndex = orders.items.findIndex(item => item.name === itemName);

      if (groupedIndex !== -1) {
        if (orders.items[groupedIndex].quantity > 1) {
          setOrders((prevOrders) => {
            const newItems = [...prevOrders.items];
            newItems[groupedIndex].quantity -= 1;
            return {
              ...prevOrders,
              items: newItems,
              total: prevOrders.total - (newItems[groupedIndex].price || 0)
            };
          });
        } else {
          handleRemoveItem(groupedIndex, false);
        }
      }
      return;
    }

    const itemToRemove = orders.items[index];

    if (!orders._id) {
      const updatedItems = orders.items.filter((_, i) => i !== index);
      setOrders((prevOrders) => ({
        ...prevOrders,
        items: updatedItems,
        total: prevOrders.total - (itemToRemove.price || 0)
      }));
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
        total: prevOrders.total - (itemToRemove.price || 0)
      }));
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

  const handleConfirmCloseOrder = () => {
    setOrders((prevOrders) => ({
      ...prevOrders,
      status: 'aguardandoPagamento',
    }));
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleNumPeopleChange = (e) => {
    const num = parseInt(e.target.value) || 1;
    setNumPeople(num);
    setPaymentMethods(new Array(num).fill("dinheiro"));
  };

  const handlePaymentMethodChange = (index, method) => {
    const newPaymentMethods = [...paymentMethods];
    newPaymentMethods[index] = method;
    setPaymentMethods(newPaymentMethods);
  };

  const closeOrder = () => {
    setShowModal(true);
    setOrders((prevOrders) => ({
      ...prevOrders,
      status: 'aguardandoPagamento',
    }));
  };

  const markAsPaid = async () => {
    try {
      const orderId = orders._id;
      const tableNumber = orders.tableNumber;
      const dividirConta = isDividing ? numPeople : 1;

      const updatedItems = orders.items.map((item) => ({
        ...item,
        status: 'entregue'
      }));

      const formasPagamento = paymentMethods.map((tipo) => ({
        tipo: tipo,
        valor: totalPerPerson
      }));

      await axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order/${orderId}`, {
        dividirConta: dividirConta,
        formaPagamento: formasPagamento,
        status: 'pago',
        items: updatedItems,
      });

      await axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/table/${tableNumber}`, {
        status: 'livre'
      });

      setOrders({
        status: 'pago',
        total: 0,
        items: [],
      });

      handleConfirmCloseOrder();
      navigate('/mesas');
    } catch (error) {
      console.error('Erro ao marcar o pedido como pago:', error);
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
          status: item.status === 'entregue' ? 'entregue' : 'emPreparo'
        }))
      };

      const response = await axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order`, orderData);

      if (response.status === 201) {
        setOrders((prevOrders) => ({
          ...prevOrders,
          items: prevOrders.items.map(item => ({
            ...item,
            status: item.status === 'entregue' ? 'entregue' : 'emPreparo'
          }))
        }));
        navigate('/mesas');
      }
    } catch (error) {
      console.error('Erro ao enviar para a cozinha ou marcar mesa como ocupada:', error);
    }
  };

  const updateKitchen = async () => {
    const foodItems = orders.items;
    const orderData = {
      items: foodItems.map(item => ({
        ...item,
        status: item.status === 'entregue' ? 'entregue' : 'emPreparo'
      }))
    };

    const response = await axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order/update/${orders._id}`, orderData.items);

    if (response.status === 201 || response.status === 200) {
      setOrders((prevOrders) => ({
        ...prevOrders,
        items: prevOrders.items.map(item => ({
          ...item,
          status: item.status === 'entregue' ? 'entregue' : 'emPreparo'
        }))
      }));
    }
  };

  return (
    <div>
      <Header />
      <div className="container p-3">
        <div>
          <h1>Mesa {id}</h1>
          <p>Total: R${orders.total ? orders.total.toFixed(2) : '0.00'}</p>

          <div className="search-bar mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Pesquisar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <h5>Itens do Cardápio:</h5>
          <Cardapio handleAddItem={handleAddItem} searchTerm={searchTerm} />
          <h5>Itens no Pedido:</h5>
          <div ref={printRef}>
            {orders.items && orders.items.length > 0 ? (
              <ul>
                {orders.items.map((item, index) => {
                  if (item.category === 'cerveja' || item.category === 'refrigerante' ||
                    item.category === 'doses' || item.category === 'outros' || item.category === 'doces' || item.category === 'sorvetes') {

                    const groupedItems = orders.items.filter(i => i.name === item.name && i.price === item.price);
                    const quantity = groupedItems.length;

                    if (index === orders.items.findIndex(i => i.name === item.name && i.price === item.price)) {
                      return (
                        <li key={index} className="order-item mb-3">
                          <div className="d-flex flex-column">
                            <span className="mb-2">
                              <p>{item.name} - {item.observation} - R${item.price ? item.price.toFixed(2) : '0.00'}</p>
                              <p>Quantidade: {quantity}</p>
                            </span>
                            <div className="d-flex justify-content-end">
                              <button
                                className="btn btn-success me-2"
                                onClick={() => handleAddItem(item)}
                              >
                                +
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => handleRemoveItem(index, true, item.name)}
                              >
                                Excluir
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    }
                    return null;
                  }

                  return (
                    <li key={index} className="order-item mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <span>
                          <p>{item.name} - R${item.price ? item.price.toFixed(2) : '0.00'}</p>
                          <p>{!(item.category === 'nao alcoolico' || item.category === 'drinks prontos' || item.category === 'cerveja 600ml' || item.category === 'long neck' || item.category === 'outros') && (
                            <>Status: {item.status === 'emPreparo' ? 'Em Preparo' : item.status}</>
                          )}</p>
                        </span>

                        <button
                          className="btn btn-danger"
                          onClick={() => handleRemoveItem(index, false)}
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
                  );
                })}
              </ul>
            ) : (
              <p>Nenhum item no pedido em preparo.</p>
            )}
          </div>

          {(!orders._id || orders.status === 'emAtendimento') && (
            <button onClick={sendToKitchen} className="btn btn-primary m-3">
              Enviar pedido
            </button>
          )}

          {orders._id && orders.status === 'emPreparo' && (
            <>
              <div className='d-flex justify-content-end'>
                <button onClick={updateKitchen} className="btn btn-primary m-3">
                  Atualizar pedido
                </button>
                <button onClick={closeOrder} className="btn btn-primary m-3">
                  Fechar Comanda
                </button>
                <button onClick={handlePrint} className="btn btn-success m-3">
                  Imprimir pedido
                </button>
              </div>
            </>
          )}

          {orders.status === 'aguardandoPagamento' && (
            <>
              <div className='d-flex justify-content-end'>
                <button onClick={updateKitchen} className="btn btn-primary m-3">
                  Atualizar pedido
                </button>
                <button onClick={closeOrder} className="btn btn-primary m-3">
                  Fechar Comanda
                </button>
                <button onClick={handlePrint} className="btn btn-success m-3">
                  Imprimir pedido
                </button>
              </div>
            </>
          )}

          <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Fechar Comanda</h5>
                  <button type="button" className="btn-close" onClick={handleClose}></button>
                </div>

                {isDividing && (
                  <>
                    <div className="modal-body">
                      <label>Deseja dividir a conta com quantas pessoas?</label>
                      <input type="number" className='form-control' value={numPeople} onChange={handleNumPeopleChange} />
                    </div>
                    <div className="modal-body">
                      <h5>Valor por pessoa: R${totalPerPerson.toFixed(2)}</h5>
                    </div>

                    {Array.from({ length: numPeople }).map((_, index) => (
                      <div key={index} className="modal-body">
                        <label>Forma de pagamento para pessoa {index + 1}:</label>
                        <select
                          className="form-select"
                          value={paymentMethods[index]}
                          onChange={(e) => handlePaymentMethodChange(index, e.target.value)}
                        >
                          <option value="dinheiro">Dinheiro</option>
                          <option value="credito">Crédito</option>
                          <option value="debito">Débito</option>
                          <option value="pix">Pix</option>
                          <option value="transferencia">Transferência (mumbuca)</option>
                        </select>
                      </div>
                    ))}
                  </>
                )}

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancelar</button>
                  <button type="button" className="btn btn-primary" onClick={markAsPaid}>Confirmar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
