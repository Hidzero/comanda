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

  const [showModal, setShowModal] = useState(false);
  const [isDividing, setIsDividing] = useState(true);
  const [numPeople, setNumPeople] = useState(1);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const totalPerPerson = orders.total / numPeople;


  const getOrdersByTableName = async (tableName) => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order/${tableName}`);
      const datas = response.data;

      // Verifica se há pedidos com status 'emPreparo' ou 'aguardandoPagamento'
      const activeOrder = datas.data.find(data => data.status === 'emPreparo' || data.status === 'aguardandoPagamento');

      if (activeOrder) {
        // Recalcula o total baseado nos itens
        const total = activeOrder.items.reduce((acc, item) => acc + (item.price || 0), 0);

        setOrders({
          ...activeOrder,
          total, // Define o total calculado
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
      // alert("Este item já foi entregue e não pode ser removido.");
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

      // alert("Item removido com sucesso!");

    } catch (error) {
      console.error('Erro ao remover item:', error);
      // alert('Erro ao remover item.');
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
    setShowModal(false); // Fecha o modal após confirmar
  };

  const handleClose = () => {
    setShowModal(false); // Fecha o modal
  };

  const handleCheckboxChange = (e) => {
    setIsDividing(e.target.checked); // Atualiza o estado baseado no checkbox
  };

  // Função para lidar com mudança na quantidade de pessoas
  const handleNumPeopleChange = (e) => {
    const num = parseInt(e.target.value) || 1;
    setNumPeople(num);

    // Atualiza o array de métodos de pagamento para o número de pessoas
    setPaymentMethods(new Array(num).fill("dinheiro"));
  };

  // Função para lidar com a mudança de forma de pagamento para cada pessoa
  const handlePaymentMethodChange = (index, method) => {
    const newPaymentMethods = [...paymentMethods];
    newPaymentMethods[index] = method;
    setPaymentMethods(newPaymentMethods);
  };

  const closeOrder = () => {
    setShowModal(true); // Abre o modal
    setOrders((prevOrders) => ({
      ...prevOrders,
      status: 'aguardandoPagamento',
    }));
  };

  const markAsPaid = async () => {
    try {
      const orderId = orders._id;
      const tableNumber = orders.tableNumber;
      const dividirConta = isDividing ? numPeople : 1; // Verifica se está dividindo a conta
  
      // Cria um array com os métodos de pagamento e o valor por pessoa
      const formasPagamento = paymentMethods.map((tipo) => ({
        tipo: tipo,
        valor: totalPerPerson
      }));
  
      await axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order/${orderId}`, {
        dividirConta: dividirConta,
        formaPagamento: formasPagamento,
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
      handleConfirmCloseOrder();
      // alert('Pedido marcado como pago!');
      navigate('/mesas');
  
    } catch (error) {
      console.error('Erro ao marcar o pedido como pago:', error);
      // alert('Erro ao marcar o pedido como pago.');
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
        // alert("Itens enviados para a cozinha com sucesso!");
      } else if (response.status === 200) {
        // alert("Pedido atualizado com sucesso!");
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
      // alert("Erro ao enviar os itens para a cozinha ou marcar a mesa como ocupada.");
    }
  };

  const updateKitchen = async () => {
    const foodItems = orders.items;
    const orderData = {
      items: [...foodItems]
    };

    const response = await axios.put(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/order/update/${orders._id}`, orderData.items);

    if (response.status === 201) {
      // alert("Itens enviados para a cozinha com sucesso!");
    } else if (response.status === 200) {
      // alert("Pedido atualizado com sucesso!");
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

          {/* Modal Bootstrap */}
          <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Fechar Comanda</h5>
                  <button type="button" className="btn-close" onClick={handleClose}></button>
                </div>

                {/* Exibe as opções extras somente se o checkbox estiver marcado */}
                {isDividing && (
                  <>
                    <div className="modal-body">
                      <label>Deseja dividir a conta com quantas pessoas?</label>
                      <input type="number" className='form-control' value={numPeople} onChange={handleNumPeopleChange} />
                    </div>
                    <div className="modal-body">
                      <h5>Valor por pessoa: R${totalPerPerson.toFixed(2)}</h5>
                    </div>

                    {/* Seletor de forma de pagamento para cada pessoa */}
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

          <h5>Itens no Pedido:</h5>
          {orders.items && orders.items.length > 0 ? (
            <ul>
              {orders.items.map((item, index) => (
                <li key={index} className="order-item mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>
                      {item.name} - R${item.price ? item.price.toFixed(2) : '0.00'}
                      {!(item.category === 'nao alcoolico' || item.category === 'drinks prontos' || item.category === 'cerveja 600ml' || item.category === 'long neck' || item.category === 'outros') && (
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
