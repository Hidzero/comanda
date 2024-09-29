import React, { useState, useEffect } from 'react';
import MenuList from './menuList.js';
import axios from 'axios';

function Cardapio({ handleAddItem, searchTerm }) { // Adiciona a prop `searchTerm`
  const [activeCategory, setActiveCategory] = useState('combos');
  const [menuData, setMenuData] = useState({
    combos: [],
    porcoesSeparadas: [],
    meiaPorcao: [],
    churrascoNoPalito: [],
    naoAlcoolicos: [],
    drinksProntos: [],
    cerveja600ml: [],
    longNeck: [],
    doces: [],
    sorvetes: [],
    pf: [],
    refeicao: [],
    outros: []
  });
  const [loading, setLoading] = useState(true);

  const getAllItems = async () => {
    try {
      const response = await axios.get(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/product`);
      const data = response.data;

      setMenuData({
        combos: data.filter(item => item.category === 'combo'),
        porcoesSeparadas: data.filter(item => item.category === 'porcao'),
        meiaPorcao: data.filter(item => item.category === 'meia porcao'),
        churrascoNoPalito: data.filter(item => item.category === 'churrasco'),
        naoAlcoolicos: data.filter(item => item.category === 'nao alcoolico'),
        drinksProntos: data.filter(item => item.category === 'drinks prontos'),
        cerveja600ml: data.filter(item => item.category === 'cerveja 600ml'),
        longNeck: data.filter(item => item.category === 'long neck'),
        doces: data.filter(item => item.category === 'doces'),
        sorvetes: data.filter(item => item.category === 'sorvetes'),
        pf: data.filter(item => item.category === 'pf'),
        refeicao: data.filter(item => item.category === 'refeicao'),
        outros: data.filter(item => item.category === 'outros')
      });

      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllItems();
  }, []);

  // Filtra os itens do menu com base no `searchTerm`
  const filterItems = (items) => {
    if (!searchTerm) return items; // Se não houver termo de pesquisa, retorna todos os itens
    return items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const renderMenuList = () => {
    if (loading) {
      return <p>Carregando...</p>;
    }

    switch (activeCategory) {
      case 'combos':
        return <MenuList items={filterItems(menuData.combos)} handleAddItem={handleAddItem} />;
      case 'porcoesSeparadas':
        return <MenuList items={filterItems(menuData.porcoesSeparadas)} handleAddItem={handleAddItem} />;
      case 'meiaPorcao':
        return <MenuList items={filterItems(menuData.meiaPorcao)} handleAddItem={handleAddItem} />;
      case 'churrascoNoPalito':
        return <MenuList items={filterItems(menuData.churrascoNoPalito)} handleAddItem={handleAddItem} />;
      case 'naoAlcoolicos':
        return <MenuList items={filterItems(menuData.naoAlcoolicos)} handleAddItem={handleAddItem} />;
      case 'drinksProntos':
        return <MenuList items={filterItems(menuData.drinksProntos)} handleAddItem={handleAddItem} />;
      case 'cerveja600ml':
        return <MenuList items={filterItems(menuData.cerveja600ml)} handleAddItem={handleAddItem} />;
      case 'longNeck':
        return <MenuList items={filterItems(menuData.longNeck)} handleAddItem={handleAddItem} />;
      case 'doces':
        return <MenuList items={filterItems(menuData.doces)} handleAddItem={handleAddItem} />;
      case 'sorvetes':
        return <MenuList items={filterItems(menuData.sorvetes)} handleAddItem={handleAddItem} />;
      case 'pf':
        return <MenuList items={filterItems(menuData.pf)} handleAddItem={handleAddItem} />;
      case 'refeicao':
        return <MenuList items={filterItems(menuData.refeicao)} handleAddItem={handleAddItem} />;
      case 'outros':
        return <MenuList items={filterItems(menuData.outros)} handleAddItem={handleAddItem} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <nav className="height">
        <ul className="menu-bar mb-3 d-flex">
          <li className={`menu-item ${activeCategory === 'combos' ? 'active' : ''}`}>
            <button onClick={() => setActiveCategory('combos')}>Combos</button>
          </li>
          <li className={`menu-item ${activeCategory === 'porcoesSeparadas' ? 'active' : ''}`}>
            <button onClick={() => setActiveCategory('porcoesSeparadas')}>Porções Separadas</button>
          </li>
          <li className={`menu-item ${activeCategory === 'meiaPorcao' ? 'active' : ''}`}>
            <button onClick={() => setActiveCategory('meiaPorcao')}>Meia Porção</button>
          </li>
          <li className={`menu-item ${activeCategory === 'churrascoNoPalito' ? 'active' : ''}`}>
            <button onClick={() => setActiveCategory('churrascoNoPalito')}>Churrasco No Palito</button>
          </li>
          <li className={`menu-item ${activeCategory === 'naoAlcoolicos' ? 'active' : ''}`}>
            <button onClick={() => setActiveCategory('naoAlcoolicos')}>Não Alcoólicos</button>
          </li>
          <li className={`menu-item ${activeCategory === 'drinksProntos' ? 'active' : ''}`}>
            <button onClick={() => setActiveCategory('drinksProntos')}>Drinks Prontos</button>
          </li>
          <li className={`menu-item ${activeCategory === 'cerveja600ml' ? 'active' : ''}`}>
            <button onClick={() => setActiveCategory('cerveja600ml')}>Cerveja 600 ml</button>
          </li>
          <li className={`menu-item ${activeCategory === 'longNeck' ? 'active' : ''}`}>
            <button onClick={() => setActiveCategory('longNeck')}>Long Neck</button>
          </li>
          <li className={`menu-item ${activeCategory === 'doces' ? 'active' : ''}`}>
            <button onClick={() => setActiveCategory('doces')}>Doces</button>
          </li>
          <li className={`menu-item ${activeCategory === 'sorvetes' ? 'active' : ''}`}>
            <button onClick={() => setActiveCategory('sorvetes')}>Sorvetes</button>
          </li>
          <li className={`menu-item ${activeCategory === 'pf' ? 'active' : ''}`}>
            <button onClick={() => setActiveCategory('pf')}>Prato Feito</button>
          </li>
          <li className={`menu-item ${activeCategory === 'refeicao' ? 'active' : ''}`}>
            <button onClick={() => setActiveCategory('refeicao')}>Refeição</button>
          </li>
          <li className={`menu-item ${activeCategory === 'outros' ? 'active' : ''}`}>
            <button onClick={() => setActiveCategory('outros')}>Outros</button>
          </li>
        </ul>
      </nav>

      {renderMenuList()}

      <style jsx="true">
        {`
          .menu-bar {
            display: flex;
            justify-content: flex-start;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
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

          .menu-item button {
            display: block;
            width: 100%;
            height: 100%;
            text-align: center;
            text-decoration: none;
            color: white;
            background-color: #ff3030;
            padding: 0 15px;
            border-radius: 5px;
            border: none;
            cursor: pointer;
          }

          .menu-item.active button {
            background-color: darkred;
          }

          .menu-bar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
}

export default Cardapio;
