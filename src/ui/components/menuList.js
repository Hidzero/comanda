import React from 'react';
import MenuItem from './menuItem.js';

const MenuList = ({ items, handleAddItem }) => (
  <div className="menu-list"> {/* Alterado para um container em forma de lista */}
    {items.map(item => (
      <MenuItem
        key={item._id}
        combo_name={item.combo_name}
        name={item.name}
        price={item.price}
        description={item.description}
        item={item}
        handleAddItem={handleAddItem} // Passa a função para o MenuItem
      />
    ))}
  </div>
);

export default MenuList;
