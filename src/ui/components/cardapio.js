// cardapio.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MenuList from './menuList';
import { combosData, porcoesSeparadasData, meiaPorcao, churrascoNoPalito, naoAlcoolicos, drinksProntos, cerveja600ml, longNeck } from './menuData';

function Cardapio({ handleAddItem }) {
  return (
    <Router>
      <div>
        <nav className='height'>
          <ul className="menu-bar mb-3 d-flex">
            <li className="menu-item"><Link to="/combos">Combos</Link></li>
            <li className="menu-item"><Link to="/porcoes-separadas">Porções Separadas</Link></li>
            <li className="menu-item"><Link to="/meia-porcao">Meia Porção</Link></li>
            <li className="menu-item"><Link to="/churrasco-no-palito">Churrasco No Palito</Link></li>
            <li className="menu-item"><Link to="/nao-alcoolicos">Não Alcoólicos</Link></li>
            <li className="menu-item"><Link to="/drinks-prontos">Drinks Prontos</Link></li>
            <li className="menu-item"><Link to="/cerveja-600ml">Cerveja 600 ml</Link></li>
            <li className="menu-item"><Link to="/long-neck">Long Neck</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/combos" element={<MenuList items={combosData} handleAddItem={handleAddItem} />} />
          <Route path="/porcoes-separadas" element={<MenuList items={porcoesSeparadasData} handleAddItem={handleAddItem} />} />
          <Route path="/meia-porcao" element={<MenuList items={meiaPorcao} handleAddItem={handleAddItem} />} />
          <Route path="/churrasco-no-palito" element={<MenuList items={churrascoNoPalito} handleAddItem={handleAddItem} />} />
          <Route path="/nao-alcoolicos" element={<MenuList items={naoAlcoolicos} handleAddItem={handleAddItem} />} />
          <Route path="/drinks-prontos" element={<MenuList items={drinksProntos} handleAddItem={handleAddItem} />} />
          <Route path="/cerveja-600ml" element={<MenuList items={cerveja600ml} handleAddItem={handleAddItem} />} />
          <Route path="/long-neck" element={<MenuList items={longNeck} handleAddItem={handleAddItem} />} />
        </Routes>
      </div>
      <style jsx="true">
        {`
          .menu-bar {
            display: flex;
            justify-content: flex-start; /* Mantém o conteúdo à esquerda para começar */
            overflow-x: auto;
            -webkit-overflow-scrolling: touch; /* Rolar suave no mobile */
            white-space: nowrap;
            padding: 0;
            margin: 0;
            list-style: none;
            width: 100%;
          }

          .menu-item {
            display: inline-block;
            flex: 0 0 auto;
            height: 40px;
            line-height: 40px;
            padding: 0 5px;
            white-space: nowrap;
          }

          .menu-item a {
            display: block;
            width: 100%;
            height: 100%;
            text-align: center;
            text-decoration: none;
            color: white;
            background-color: red;
            padding: 0 15px;
            border-radius: 5px;
          }

          .menu-item a:focus {
            outline: none;
            box-shadow: none;
          }

          /* Estilo para garantir que o conteúdo não seja cortado */
          .menu-bar::-webkit-scrollbar {
            display: none; /* Esconde a barra de rolagem */
          }

          @media (max-height: 935px) {
          .menu-item {
            display: inline-block;
            flex: 0 0 auto;
            height: 40px;
            line-height: 40px;
            padding: 0 5px;
            white-space: nowrap;
          }
          }
        `}
      </style>
    </Router>
  );
}

export default Cardapio;
