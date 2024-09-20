import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header.js';
import axios from 'axios';

function MesaApp() {
  const navigate = useNavigate();
  const [ mesas, setMesas ] = useState([]);
  const [ loading, setLoading ] = useState(true);

  const getAllTables = async () => {
    try{
      const response = await axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/table/`);
      setMesas(response.data.data);
      setLoading(false);
    }
    catch(error){
      console.error('Erro ao buscar mesas:', error.response ? error.response.data : error.message);
    }
  }

  useEffect(() => {
    getAllTables();
  }
  , []);

  const handleMesaClick = (tableNumber) => {
    navigate(`/mesas/${tableNumber}`);
  };

  const renderMesas = () => {
    if (loading) {
      return <p>Carregando mesas...</p>;  // Mostra um loader enquanto as mesas estão sendo carregadas
    }

    if (mesas.length === 0) {
      return <p>Nenhuma mesa encontrada.</p>;  // Caso não tenha mesas cadastradas
    }

    return mesas.map((mesa) => {
      const isOccupied = mesa.status === 'ocupada';  // Verifica o status da mesa

      return (
        <div key={mesa.tableNumber} className="col mb-3">
          <button
            className={`btn btn-lg w-100 fs-1 ${isOccupied ? 'btn-primary' : 'btn-success'}`} // Azul para ocupada, verde para disponível
            onClick={() => handleMesaClick(mesa.tableNumber)}
          >
            {mesa.tableNumber}
          </button>
        </div>
      );
    });
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div className="mt-5 row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5">
          {renderMesas()}
        </div>
      </div>
    </div>
  );
}

export default MesaApp;
