// MenuList.js
import React from 'react';
import MenuItem from './menuItem';

const MenuList = ({ items }) => (
  <div className="d-flex flex-row mx-2">
    {items.map(item => (
      <MenuItem 
        key={item.id}
        name={item.name}
        price={item.price}
        description={item.description}
      />
    ))}
  </div>
);

export default MenuList;
