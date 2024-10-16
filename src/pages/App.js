import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login/login.js';
import Signup from './login/signup.js';
import Mesas from '../ui/components/mesas.js';
import Caixa from '../ui/components/caixa.js';
import Cozinha from '../ui/components/cozinha.js';
import Mesa from '../ui/components/mesa.js';
import { AuthProvider } from './login/authContext.js';
import PrivateRoute from './login/privateRoute.js';
import Impressao from '../ui/components/impressao.js';
import ImpressaoCaixa from '../ui/components/impressaoCaixa.js';
import ImpressaoTodosPedidos from '../ui/components/impressãoTodosPedidos.js';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Rotas protegidas */}
          <Route element={<PrivateRoute />}>
            <Route path="/caixa" element={<Caixa />} />
            <Route path="/mesas" element={<Mesas />} />
            <Route path="/cozinha" element={<Cozinha />} />
            <Route path="/mesas/:id" element={<Mesa />} />
            <Route path="/impressao" element={<Impressao />} />
            <Route path="/impressao-caixa" element={<ImpressaoCaixa />} />
            <Route path="/impressao-todos-pedidos" element={<ImpressaoTodosPedidos />} />
          </Route>

          {/* Redireciona para login por padrão */}
          <Route path="/" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
