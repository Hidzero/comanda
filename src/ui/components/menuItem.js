import React from 'react';

const MenuItem = ({ name, description, price, item, handleAddItem }) => {
  return (
    <div className="menu-item d-flex justify-content-between align-items-center p-2 mb-2 border rounded">
      <div>
        <h5 className="mb-1">{name} - {description}</h5>
        <p className="mb-0">R$ {price ? price.toFixed(2) : '0.00'}</p>
      </div>
      <button 
        className="btn btn-primary btn-sm" // Ajusta o tamanho do botão
        onClick={() => handleAddItem(item)}
      >
        +
      </button>
    </div>
  );
};

export default MenuItem;
