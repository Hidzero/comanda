import React from 'react';

const MenuItem = ({ name, combo_name, price, description, item, handleAddItem }) => (
  <div className="d-flex flex-column rounded bg-custom justify-content-between mx-2 p-3 card-container">
    <div className="flex-grow-1 d-flex flex-column justify-content-start align-items-center">
      {combo_name && <h3 className="word-wrap media text-red">{combo_name}</h3>} {/* Mostra combo_name se existir */}
      <h3 className="word-wrap media">{name}</h3>
    </div>
    
    <div className="d-flex flex-column align-items-center justify-content-end mt-auto">
      <p className="align-items-center text-center mb-2">{description}</p>
      <span className="price">R$ {price.toFixed(2)}</span>
    </div>
    
    <div className="mt-2 d-flex justify-content-center">
      <button 
        className="btn btn-red m-1"
        onClick={() => handleAddItem(item)} // Chama a função handleAddItem ao clicar
      >
        Adicionar
      </button>
    </div>

    <style jsx="true">
      {`
        .bg-custom {
          background-color: #e9ecf0;
        }

        .btn-red {
          background-color: #ff3030;
          color: white;
        }
        .bold {
            font-weight: bold;
        }

        .word-wrap {
            white-space: normal;
            word-wrap: break-word;
            word-break: break-word;
        }
        .btn-red:hover {
          background-color: #ff0000;
          color: white;
          
        }

        .btn-custom{
          background-color: #f5a623;
          margin-bottom: 50px;
        }

        .btn-custom:hover {
          background-color: #f5d900;
        }

        .text-red {
          color: red;
        }

        .word-wrap {
          white-space: normal;
          word-wrap: break-word;
          word-break: break-word;
        }

        .card-container {
          min-width: 250px;
          max-width: 250px;
          height: 100%;
          min-height: 360px;
          display: flex;
          flex-direction: column;
        }

        .media {
          font-size: 20px !important;
          text-align: center;
        }

        .price {
          font-size: 18px;
          font-weight: bold;
        }

        .align-items-center {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        @media (max-width: 630px) {
          .card-container {
            width: 100%;
            height: 100%;
            min-height: 205px;
          }

          .media {
            font-size: 15px !important;
          }

          .price {
            font-size: 16px;
          }
        }
      `}
    </style>
  </div>
);

export default MenuItem;
