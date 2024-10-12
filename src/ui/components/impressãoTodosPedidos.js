import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo_porco from '../../logo-porco.png'; // Assumindo que o logo é o mesmo no Impressao.js

export default function ImpressaoTodosPedidos() {
    const location = useLocation();
    const navigate = useNavigate();
    const { orders } = location.state; // Recebe os dados de todos os pedidos do dia
    const printRef = useRef();

    useEffect(() => {
        const printTimeout = setTimeout(() => {
            window.print(); // Chama o diálogo de impressão
        }, 100); // Adiciona um pequeno atraso para garantir que o conteúdo seja renderizado

        const handleAfterPrint = () => {
            navigate('/caixa'); // Redireciona para a página do caixa após impressão ou cancelamento
        };

        window.addEventListener('afterprint', handleAfterPrint);

        return () => {
            clearTimeout(printTimeout);
            window.removeEventListener('afterprint', handleAfterPrint);
        };
    }, [navigate]);

    const calculateOrderTotal = (order) => {
        return order.items.reduce((total, item) => total + (item.price || 0), 0);
    };

    const calculateTotalAllOrders = () => {
        return orders.reduce((total, order) => total + calculateOrderTotal(order), 0);
    };

    return (
        <div ref={printRef} style={{ width: '80mm', fontSize: '12px', fontFamily: 'Arial, sans-serif', margin: '0 auto' }}>
            {/* Cabeçalho com o logo */}
            <div className='d-flex flex-column justify-content-center align-items-center mb-4'>
                <h4>Bar do Torresmo</h4>
                <img src={logo_porco} alt="Logo do restaurante" style={{ width: '60mm', height: 'auto' }} />
            </div>
            
            <h4 style={{ textAlign: 'center' }}>Pedidos do Dia</h4>
            
            {orders.map((order, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                    <h5>Mesa {order.tableNumber} - Pedido #{order.orderNumber}</h5>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {order.items.map((item, i) => (
                            <li key={i}>
                                {item.quantity || 1}x {item.name} - R${item.price ? item.price.toFixed(2) : '0.00'}
                                {item.observation && ` - ${item.observation}`}
                            </li>
                        ))}
                    </ul>
                    <p><strong>Total do pedido:</strong> R${calculateOrderTotal(order).toFixed(2)}</p>
                    <hr style={{ border: '1px dashed black' }} />
                </div>
            ))}

            {/* Total de todos os pedidos */}
            <div className='d-flex justify-content-end' style={{ marginTop: '10px' }}>
                <h5><strong>Total:</strong> R${calculateTotalAllOrders().toFixed(2)}</h5>
            </div>
        </div>
    );
}
