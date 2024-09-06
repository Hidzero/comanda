import React, { useState } from 'react';
import Cardapio from './cardapio';

function MesaApp() {
  const [numMesas] = useState(100);
  const [selectedMesa, setSelectedMesa] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [orders, setOrders] = useState({});
  const [itemToRemove, setItemToRemove] = useState(null);
  const [removalReason, setRemovalReason] = useState('');
  const [showRemovalModal, setShowRemovalModal] = useState(false);

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
      setShowOrderPopup(true);
    } else if (!orders[mesaId]) {
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setShowOrderPopup(false);
    setShowRemovalModal(false);
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

  const handleRemoveItem = () => {
    setOrders((prevOrders) => {
      const updatedItems = prevOrders[selectedMesa].items.filter(
        (_, index) => index !== itemToRemove
      );

      const updatedTotal = updatedItems.reduce((sum, item) => sum + item.price, 0);

      return {
        ...prevOrders,
        [selectedMesa]: { ...prevOrders[selectedMesa], items: updatedItems, total: updatedTotal },
      };
    });

    setRemovalReason(''); // Limpa o motivo após a remoção
    setShowRemovalModal(false); // Fecha o modal
  };

  const promptRemoveItem = (index) => {
    setItemToRemove(index);
    setShowRemovalModal(true);
  };

  const closeOrder = () => {
    if (orders[selectedMesa].items.length > 0) {
      setOrders((prevOrders) => ({
        ...prevOrders,
        [selectedMesa]: { ...prevOrders[selectedMesa], status: 'aguardandoPagamento' },
      }));
    } else {
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
      delete updatedOrders[mesaId];
      return updatedOrders;
    });
    closePopup();
  };

  return (
    <div className="container">
      <div className="content-wrapper">
        <div className="fixed-content">
          <div className="mt-5 row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5">
            {renderMesas()}
          </div>
        </div>

        <div className="scrollable-content">
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
                <Cardapio handleAddItem={handleAddItem} />
                <h5 className="mt-3">Itens no Pedido:</h5>
                <div className="items-container">
                  <ul className="list-group mb-3">
                    {orders[selectedMesa]?.items.map((item, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        {item.name} - R${item.price.toFixed(2)}
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => promptRemoveItem(index)} // Abre o modal de remoção
                        >
                          Remover
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="fixed-footer">
                  {orders[selectedMesa].status === 'emAtendimento' && (
                    <button onClick={closeOrder} className="btn btn-custom w-100">
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
            </div>
          )}
        </div>
      </div>

      {showRemovalModal && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h4>Motivo para Remover o Item</h4>
            <textarea
              value={removalReason}
              onChange={(e) => setRemovalReason(e.target.value)}
              className="form-control mb-3"
              placeholder="Informe o motivo"
            ></textarea>
            <button
              className="btn btn-danger"
              onClick={handleRemoveItem}
              disabled={!removalReason} // Desabilita o botão se o motivo não estiver preenchido
            >
              Confirmar Remoção
            </button>
            <button className="btn btn-secondary ml-2" onClick={closePopup}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <style jsx="true">{`
        .content-wrapper {
          display: flex;
          flex-direction: column;
          height: 100vh;
        }

        .fixed-content {
          flex: 0 0 auto;
          padding-bottom: 10px;
          background-color: #f8f9fa;
          border-bottom: 1px solid #dee2e6;
        }

        .scrollable-content {
          flex: 1 1 auto;
          overflow-y: auto;
          padding-top: 10px;
        }

        .items-container {
          max-height: 150px;
          overflow-y: auto;
          margin-bottom: 10px;
        }

        .fixed-footer {
          position: sticky;
          bottom: 0;
          background-color: #f8f9fa;
          padding: 10px 0;
        }

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
          max-height: 80vh;
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
        .items-container {
          max-height: 150px;
          overflow-y: auto;
          margin-bottom: 10px;
        }

        textarea.form-control {
          width: 100%;
          resize: none;
        }

        .btn-secondary {
          margin-left: 10px;
        }

        @media (max-height: 935px) {
          .popup-content {
            width: 90%;
            height: 90%;
          }

        .items-container {
          max-height: 120px;
          overflow-y: auto;
          margin-bottom: 10px;
        }
        }
      `}</style>
    </div>
  );
}

export default MesaApp;
