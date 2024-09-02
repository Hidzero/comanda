// MenuItem.js
import React from 'react';

const MenuItem = ({ name, price, description }) => (
  <div className="d-flex flex-column rounded w-25 bg-custom justify-content-center mx-2 p-3 alig-items-betw">
    <h3 >{name}</h3>
    <p>{description}</p>
    <span >R$ {price.toFixed(2)}</span>
    <div>
      <button className='btn btn-custom m-1'>Adicionar</button>
      <button className='btn btn-custom m-1'>Editar</button>
    </div>
    <style jsx="true">
        {`
        .bg-custom {
            background-color: #e9ecf0;
        }
        `}
    </style>
  </div>
);

export default MenuItem;
