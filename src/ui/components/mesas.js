import React, { useState } from 'react';

function MesaApp() {
  const [numMesas, setNumMesas] = useState(100);
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
      const isMesaInAtendimento = orders[i] && orders[i].inAtendimento;

      mesas.push(
        <div key={i} className="col mb-3">
          <button
            className={`btn w-100 ${isMesaInAtendimento ? 'btn-primary' : 'btn-success'}`}
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

    if (orders[mesaId]) {
      // Se a mesa já está em atendimento, mostrar o pop-up do pedido existente
      setShowOrderPopup(true);
    } else {
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
      [selectedMesa]: { inAtendimento: true, total: 0, items: [] },
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
          <div className="popup-content">
            <span className="close-popup" onClick={closePopup}>
              &times;
            </span>
            <h4>Pedido - Mesa {selectedMesa}</h4>
            <p>Total: R${orders[selectedMesa].total.toFixed(2)}</p>
            <h5>Itens do Cardápio:</h5>
            <ul className="list-group">
              {menuItems.map((item, index) => (
                <li key={index} className="list-group-item">
                  {item.name} - R${item.price.toFixed(2)}
                  <button
                    className="btn btn-sm btn-primary float-right"
                    onClick={() => handleAddItem(item)}
                  >
                    Adicionar
                  </button>
                </li>
              ))}
            </ul>
            <h5 className="mt-3">Itens no Pedido:</h5>
            <ul className="list-group">
              {orders[selectedMesa].items.map((item, index) => (
                <li key={index} className="list-group-item">
                  {item.name} - R${item.price.toFixed(2)}
                </li>
              ))}
            </ul>
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
      `}</style>
    </div>
  );
}

export default MesaApp;
