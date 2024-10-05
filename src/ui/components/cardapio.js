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
    cerveja: [],
    refrigerante: [],
    doses: [],
    doces: [],
    sorvetes: [],
    pf: [],
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
        cerveja: data.filter(item => item.category === 'cerveja'),
        refrigerante: data.filter(item => item.category === 'refrigerante'),
        doses: data.filter(item => item.category === 'doses'),
        doces: data.filter(item => item.category === 'doces'),
        sorvetes: data.filter(item => item.category === 'sorvetes'),
        pf: data.filter(item => item.category === 'pf'),
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
      case 'cerveja':
        return <MenuList items={filterItems(menuData.cerveja)} handleAddItem={handleAddItem} />;
      case 'refrigerante':
        return <MenuList items={filterItems(menuData.refrigerante)} handleAddItem={handleAddItem} />;
      case 'doses':
        return <MenuList items={filterItems(menuData.doses)} handleAddItem={handleAddItem} />;
      case 'doces':
        return <MenuList items={filterItems(menuData.doces)} handleAddItem={handleAddItem} />;
      case 'sorvetes':
        return <MenuList items={filterItems(menuData.sorvetes)} handleAddItem={handleAddItem} />;
      case 'pf':
        return <MenuList items={filterItems(menuData.pf)} handleAddItem={handleAddItem} />;
      case 'outros':
        return <MenuList items={filterItems(menuData.outros)} handleAddItem={handleAddItem} />;
      default:
        return null;
    }
  };

  return (
    <div className="container"> {/* Adicionado um container */}
      <nav className="mb-3">
        <div className="row gx-2"> {/* Use gx-2 para adicionar espaçamento horizontal */}
          {['combos', 'porcoesSeparadas', 'meiaPorcao', 'churrascoNoPalito', 'cerveja', 'refrigerante', 'doses', 'doces', 'sorvetes', 'pf', 'outros'].map((category) => (
            <div key={category} className="col-6 col-md-3 mb-2"> {/* Ajusta o layout para 2 itens por linha em mobile e 4 em telas maiores */}
              <button
                className={`btn w-100 ${activeCategory === category ? 'btn-danger' : 'btn-secondary'}`}
                onClick={() => setActiveCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}
              </button>
            </div>
          ))}
        </div>
      </nav>

      {renderMenuList()}
    </div>
  );
}

export default Cardapio;
