import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo_porco from '../../logo-porco.png'; // Supondo que o logo seja o mesmo usado nos outros componentes

export default function ImpressaoCaixa() {
    const location = useLocation();
    const navigate = useNavigate();
    const { order } = location.state; // Recebe os dados do pedido
    const printRef = useRef();

    useEffect(() => {
        // Defere a chamada para impressão para garantir que o ciclo de renderização seja concluído
        const printTimeout = setTimeout(() => {
            window.print(); // Chama o diálogo de impressão
        }, 100); // Adiciona um pequeno atraso para garantir que o conteúdo seja renderizado

        // O evento 'afterprint' redirecionará para o caixa após a impressão ou cancelamento
        const handleAfterPrint = () => {
            navigate('/caixa'); // Redireciona para a página do caixa após impressão ou cancelamento
        };

        window.addEventListener('afterprint', handleAfterPrint);

        // Limpa o timeout e o evento quando o componente é desmontado
        return () => {
            clearTimeout(printTimeout);
            window.removeEventListener('afterprint', handleAfterPrint);
        };
    }, [navigate]);

    const calculateOrderTotal = (order) => {
        return order.items.reduce((total, item) => total + (item.price || 0), 0);
    };

    return (
        <div ref={printRef} style={{ width: '80mm', fontSize: '12px', fontFamily: 'Arial, sans-serif', margin: '0 auto' }}>
            <div className='d-flex justify-content-center align-items-center'>
                <img src={logo_porco} alt="Logo do restaurante" style={{ width: '60mm', height: 'auto' }} />
            </div>
            <h4 style={{ textAlign: 'center' }}>Detalhes do Pedido</h4>
            <div className='d-flex flex-row justify-content-between'>
                <h5>Mesa: {order.tableNumber}</h5>
                <h5>Pedido: {order.orderNumber}</h5>
            </div>
            <div className='row form'>
                <hr />
                <div className='col-sm-1'>Quant</div>
                <div className='col-sm-8'>Descrição</div>
                <div className='col-sm-3'>Valor</div>
                <hr />
                {order.items.map((item, index) => (
                    <React.Fragment key={index}>
                        <div className='col-sm-1'>{item.quantity || 1}</div>
                        <div className='col-sm-8'>{item.name} - {item.observation || 'Sem observação'}</div>
                        <div className='col-sm-3'>R${(item.price * (item.quantity || 1)).toFixed(2)}</div>
                    </React.Fragment>
                ))}
                <hr />
            </div>
            <div className='d-flex justify-content-end'>
                <h5>Total: R${calculateOrderTotal(order).toFixed(2)}</h5>
            </div>
        </div>
    );
}
