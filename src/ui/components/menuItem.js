// MenuItem.js
import React from 'react';

const MenuItem = ({ name, price, description, item, handleAddItem }) => (
  <div className="d-flex flex-column rounded w-50 bg-custom justify-content-center mx-2 p-3 card-container">
    <div className="flex-grow-1">
      <h3 className="word-wrap">{name}</h3>
      <p>{description}</p>
      <span>R$ {price.toFixed(2)}</span>
    </div>
    <div className="mt-auto">
      <button 
        className='btn btn-custom m-1'
        onClick={() => handleAddItem(item)} // Chama a função handleAddItem ao clicar
      >
        Adicionar
      </button>
      <button className='btn btn-custom m-1'>Editar</button>
    </div>
    <style jsx="true">
        {`
        .bg-custom {
            background-color: #e9ecf0;
        }
        .word-wrap {
            white-space: normal;
            word-wrap: break-word;
            word-break: break-word;
        }
        .card-container {
            height: 100%;
        }
        `}
    </style>
  </div>
);

export default MenuItem;
