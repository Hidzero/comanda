import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Verificação se as senhas são iguais
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      // Envia uma requisição POST para o backend
      const response = await axios.post(`http://${process.env.REACT_APP_IP}:${process.env.REACT_APP_PORT}/user/`, {
        name,
        email,
        password
      });

      // Se o cadastro for bem-sucedido, redireciona para o login
      if (response.status === 201) {
        console.log('Usuário registrado com sucesso');
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      console.error('Erro no cadastro:', error.response ? error.response.data : error.message);
      setError('Ocorreu um erro ao tentar registrar. Tente novamente.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Cadastre-se</h2>
      <form onSubmit={handleSignup} style={styles.form}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.input}
        />
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
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>} {/* Exibe erro se as senhas não coincidem ou se o cadastro falhar */}

        <button type="submit" style={styles.button}>Registrar</button>
      </form>
      <p style={styles.loginText}>
        Já tem uma conta? <Link to="/">Faça login</Link>
      </p>
    </div>
  );
};

// Estilos simples para a tela de cadastro
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
    backgroundColor: '#28a745',
    color: 'white',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '14px',
  },
  loginText: {
    marginTop: '20px',
    fontSize: '14px',
  },
};

export default Signup;
