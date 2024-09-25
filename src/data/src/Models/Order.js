import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true },
  orderNumber: { type: Number, required: true, unique: true }, // Número do pedido
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      category: { type: String, required: true },  // Para diferenciar alimentos e bebidas
      observation: { type: String, default: '' },
      status: { type: String, enum: ['emPreparo', 'entregue'], default: 'emPreparo' }, // Status do item (novo campo)
      createdAt: { type: Date, default: Date.now }  // Timestamp de quando o pedido foi feito
    }
  ],
  status: { type: String, enum: ['emPreparo', 'pronto'], default: 'emPreparo', required: true },  // Status geral do pedido
  dividirConta: { type: Number, default: 1 },  // Número de pessoas para dividir a conta
  formaPagamento: [
    {
      tipo: { type: String, enum: ['dinheiro', 'crédito','debito', 'pix', 'trasnferencia'] },
      valor: { type: Number }
    }
  ],  // Forma de pagamento
  createdAt: { type: Date, default: Date.now },  // Data e hora do pedido
}, { timestamps: true });


export default mongoose.model('Order', orderSchema);