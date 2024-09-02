import React, { useState } from 'react';
import Cardapio from './cardapio';
// import { Cardapio } from 'Cardapio.js'

function MesaApp() {
  const [numMesas] = useState(100);
  const [selectedMesa, setSelectedMesa] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [orders, setOrders] = useState({});

  const menuItems = [
    { name: 'Item 1', price: 10 },
    { name: 'Item 2', price: 15 },
    { name: 'Item 3', price: 20 },
    // Adicione mais itens do cardápio aqui
  ];

  const renderMesas = () => {
    const mesas = [];
    for (let i = 1; i <= numMesas; i++) {
      const order = orders[i];
      let buttonClass = 'btn-success';

      if (order) {
        if (order.status === 'aguardandoPagamento') {
          buttonClass = 'btn-warning';
        } else if (order.status === 'emAtendimento') {
          buttonClass = 'btn-primary';
        }
      }

      mesas.push(
        <div key={i} className="col mb-3">
          <button
            className={`btn btn-lg w-100 fs-1 ${buttonClass}`}
            onClick={() => handleMesaClick(i)}
          >
            {i}
          </button>
        </div>
      );
    }
    return mesas;
  };

  const handleMesaClick = (mesaId) => {
    setSelectedMesa(mesaId);

    if (orders[mesaId] && orders[mesaId].status !== 'pago') {
      // Se a mesa já está em atendimento ou aguardando pagamento, mostrar o pop-up do pedido existente
      setShowOrderPopup(true);
    } else if (!orders[mesaId]) {
      // Se a mesa não está em atendimento, mostrar o pop-up para iniciar o atendimento
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setShowOrderPopup(false);
  };

  const initiateOrder = () => {
    setOrders((prevOrders) => ({
      ...prevOrders,
      [selectedMesa]: { status: 'emAtendimento', total: 0, items: [] },
    }));
    setShowPopup(false);
    setShowOrderPopup(true);
  };

  const handleAddItem = (item) => {
    setOrders((prevOrders) => {
      const updatedOrder = {
        ...prevOrders[selectedMesa],
        total: prevOrders[selectedMesa].total + item.price,
        items: [...prevOrders[selectedMesa].items, item],
      };

      return {
        ...prevOrders,
        [selectedMesa]: updatedOrder,
      };
    });
  };

  const closeOrder = () => {
    // Verificar se há itens no pedido antes de mudar o estado para "aguardandoPagamento"
    if (orders[selectedMesa].items.length > 0) {
      setOrders((prevOrders) => ({
        ...prevOrders,
        [selectedMesa]: { ...prevOrders[selectedMesa], status: 'aguardandoPagamento' },
      }));
    } else {
      // Se não houver itens, cancelar o atendimento e liberar a mesa
      setOrders((prevOrders) => {
        const updatedOrders = { ...prevOrders };
        delete updatedOrders[selectedMesa];
        return updatedOrders;
      });
    }
    closePopup();
  };

  const markAsPaid = (mesaId) => {
    setOrders((prevOrders) => {
      const updatedOrders = { ...prevOrders };
      delete updatedOrders[mesaId]; // Remove o pedido da mesa para liberá-la
      return updatedOrders;
    });
    closePopup();
  };

  return (
    <div className="container">
      <div className="mt-5 row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5">
        {renderMesas()}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <span className="close-popup" onClick={closePopup}>
              &times;
            </span>
            <h4>Mesa {selectedMesa}</h4>
            <p>Deseja iniciar o atendimento à Mesa {selectedMesa}?</p>
            <button onClick={initiateOrder} className="btn btn-custom">
              Iniciar
            </button>
          </div>
        </div>
      )}

      {showOrderPopup && (
        <div className="popup-overlay">
          <div className="popup-content w">
            <span className="close-popup" onClick={closePopup}>
              &times;
            </span>
            <h4>Pedido - Mesa {selectedMesa}</h4>
            <p>Total: R${orders[selectedMesa].total.toFixed(2)}</p>
            <h5>Itens do Cardápio:</h5>
            <ul className="list-group">
              <Cardapio />
              {/* {menuItems.map((item, index) => (
                <li key={index} className="list-group-item">
                  {item.name} - R${item.price.toFixed(2)}
                  <button
                    className="btn btn-sm btn-primary float-right"
                    onClick={() => handleAddItem(item)}
                  >
                    Adicionar
                  </button>
                </li>
              ))} */}
            </ul>
            <h5 className="mt-3">Itens no Pedido:</h5>
            <ul className="list-group mb-3">
              {orders[selectedMesa].items.map((item, index) => (
                <li key={index} className="list-group-item">
                  {item.name} - R${item.price.toFixed(2)}
                </li>
              ))}
            </ul>
            {orders[selectedMesa].status === 'emAtendimento' && (
              <button onClick={closeOrder} className="btn btn-danger w-100">
                Fechar Comanda
              </button>
            )}
            {orders[selectedMesa].status === 'aguardandoPagamento' && (
              <button onClick={() => markAsPaid(selectedMesa)} className="btn btn-success w-100">
                Marcar como Pago
              </button>
            )}
          </div>
        </div>
      )}

      <style jsx="true">{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .popup-content {
          background-color: white;
          padding: 20px;
          border-radius: 5px;
          width: 300px;
          text-align: center;
          position: relative;
        }

        .close-popup {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 24px;
          cursor: pointer;
        }

        .btn-custom {
          background-color: #ff0000;
          color: #fff;
          border: none;
        }

        .btn-custom:hover {
          background-color: #722415;
          color: #fff;
        }

        .list-group-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .w {
          width: 1180px;
        }

        @media (max-width: 1570px) {
          .w {
            width: 75%;
          }
        }

        }
      `}</style>
    </div>
  );
}

export default MesaApp;
