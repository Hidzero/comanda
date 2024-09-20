import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Inicialmente, nenhum usuário está logado

  // Carregar o estado do usuário do localStorage ao carregar a página
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erro ao carregar o usuário do localStorage:', error);
      }
    }
  }, []);
  

  // Salvar o estado do usuário no localStorage quando o usuário mudar
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));  // Armazena os dados do usuário como JSON
    } else {
      localStorage.removeItem('user');  // Remove o usuário se ele for null ou undefined
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
