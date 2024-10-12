import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo_porco from '../../logo-porco.png';

export default function Impressao() {
    const location = useLocation();
    const navigate = useNavigate();
    const { items, tableNumber, orderNumber } = location.state; // Recebe os itens, número da mesa e número do pedido
    const printRef = useRef();
    const hasPrinted = useRef(false); // Usamos uma referência para rastrear se a impressão já foi feita

    // Função para calcular o total do pedido
    const calculateTotal = () => {
        return items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
    };

    useEffect(() => {
        // Verifica se já imprimimos para evitar duplicidade
        if (!hasPrinted.current) {
            window.print();
            hasPrinted.current = true; // Define que a impressão foi realizada
        }

        // Adiciona um pequeno atraso antes de redirecionar, para garantir que a impressão tenha sido processada
        const timer = setTimeout(() => {
            navigate(`/mesas/${tableNumber}`); // Redireciona para a página da mesa
        }, 500); // 0.5 segundos de atraso

        return () => clearTimeout(timer); // Limpa o timeout ao desmontar o componente
    }, [navigate, tableNumber]);

    return (
        <div ref={printRef} style={{ width: '80mm', fontSize: '12px', fontFamily: 'Arial, sans-serif' }}>
            <div className='d-flex flex-column justify-content-center align-items-center mb-4'>
                <h4>Bar do Torresmo</h4>
                <img src={logo_porco} alt="Logo do restaurante" style={{ width: '60mm', height: 'auto' }} />
            </div>
            <h4 style={{ textAlign: 'center' }}>Itens do Pedido</h4>
            <div className='d-flex flex-row justify-content-between' style={{ marginBottom: '5mm' }}>
                <h5>Mesa: {tableNumber}</h5>
                <h5>Pedido: {orderNumber}</h5>
            </div>
            <div className='row form'>
                <hr style={{ border: '1px dashed black' }} />
                <div className='col-sm-1' style={{ width: '15mm', display: 'inline-block' }}>
                    Quant
                </div>
                <div className='col-sm-8' style={{ width: '40mm', display: 'inline-block' }}>
                    Descrição
                </div>
                <div className='col-sm-3' style={{ width: '20mm', display: 'inline-block', textAlign: 'right' }}>
                    Valor
                </div>
                <hr style={{ border: '1px dashed black' }} />
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        <div className='col-sm-1' style={{ width: '15mm', display: 'inline-block' }}>
                            {item.quantity || 1}
                        </div>
                        <div className='col-sm-8' style={{ width: '40mm', display: 'inline-block' }}>
                            {item.name} - {item.observation || 'Sem observação'}
                        </div>
                        <div className='col-sm-3' style={{ width: '20mm', display: 'inline-block', textAlign: 'right' }}>
                            R${(item.price * (item.quantity || 1)).toFixed(2)}
                        </div>
                    </React.Fragment>
                ))}
                <hr style={{ border: '1px dashed black' }} />
            </div>
            <div className='d-flex justify-content-end' style={{ marginTop: '5mm' }}>
                <h5>Total: R${calculateTotal().toFixed(2)}</h5> {/* Exibe o total do pedido */}
            </div>
        </div>
    );
}
