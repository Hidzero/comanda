import React from 'react';

const MenuItem = ({ name, price, description, item, handleAddItem }) => (
  <div className="d-flex flex-column rounded w-50 bg-custom justify-content-center mx-2 p-3 card-container h-min w-max">
    <div className="flex-grow-1 flex-row">
      <h3 className="word-wrap media">{name}</h3>
      <p className='align-items-end'>{description}</p>
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

        .h-min {
            min-height: 280px !important;
        }

        .w-max {
            max-width: 210px;
        }

        .media {
          font-size: 20px !important;
        }

        @media (max-width: 630px) {
          .card-container {
            width: 100% !important;
            height: 100% !important;
          }

          .media {
            font-size: 15px !important;
          }

            
          .h-min {
              min-height: 205px !important;
          }

        }
        `}
    </style>
  </div>
);

export default MenuItem;
