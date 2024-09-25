import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from './authContext.js';

const Login = () => {
  const { setUser } = useContext(AuthContext);  // Contexto para salvar o usuário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  // Para exibir mensagens de erro
  const navigate = useNavigate();  // Hook de navegação para redirecionamento

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/user/login`, {
        email,
        password,
      });
  
      if (response.status === 200 && response.data && response.data.data) {
        const userData = response.data.data;
        setUser(userData);
        navigate('/mesas');  // Redireciona para a rota protegida "/mesas"
      } else {  
        setError('Dados de usuário inválidos. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro no login:', error.response ? error.response.data : error.message);
      setError('Credenciais inválidas. Tente novamente.');
    }
  };
  

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete='on'
          required
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}  {/* Exibe a mensagem de erro */}
        <button type="submit" style={styles.button}>Entrar</button>
      </form>
    </div>
  );
};

// Estilos simples para a tela de login
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4',
    padding: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    gap: '10px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: 'white',
    cursor: 'pointer',
  },
  signupText: {
    marginTop: '20px',
    fontSize: '14px',
  },
  error: {
    color: 'red',
    fontSize: '14px',
  },
};

export default Login;
