import { createContext, useContext, useState } from 'react';
import { mockMenus } from '../utils/mockData';

const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [menus, setMenus] = useState(mockMenus);

  const addMenu = (menu) => {
    const newMenu = { ...menu, id: Date.now() };
    setMenus(prev => [...prev, newMenu]);
  };

  const updateMenu = (id, updatedMenu) => {
    setMenus(prev => prev.map(m => m.id === id ? { ...m, ...updatedMenu } : m));
  };

  const getMenuByDate = (date) => menus.filter(m => m.date === date);

  return (
    <MenuContext.Provider value={{ menus, addMenu, updateMenu, getMenuByDate }}>
      {children}
    </MenuContext.Provider>
  );
}

export const useMenu = () => useContext(MenuContext);
