// MenuList.js
import React from 'react';
import MenuItem from './menuItem';

const MenuList = ({ items, handleAddItem }) => (
  <div className="menu-bar mb-3 d-flex">
    {items.map(item => (
      <MenuItem
        key={item.id}
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
