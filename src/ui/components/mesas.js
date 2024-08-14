import React, { useState } from 'react';

function MesaApp() {
  const [numMesas, setNumMesas] = useState(25); // Por padrão, 25 mesas

  // Função para gerar as mesas
  const renderMesas = () => {
    const mesas = [];
    for (let i = 1; i <= numMesas; i++) {
      mesas.push(
        <div key={i} className="col mb-3">
          <button className="btn btn-success w-100">MESA {i}</button>
        </div>
      );
    }
    return mesas;
  };

  return (
    <div className="container">
      <div className="mb-4 mt-5">
        <label htmlFor="mesaCount">Escolha a quantidade de mesas:</label>
        <input
          type="number"
          id="mesaCount"
          value={numMesas}
          onChange={(e) => setNumMesas(Number(e.target.value))}
          min="1"
          className="form-control"
        />
      </div>
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5">
        {renderMesas()}
      </div>

    </div>
  );
}

export default MesaApp;
