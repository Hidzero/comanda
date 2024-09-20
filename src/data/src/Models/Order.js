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
      createdAt: { type: Date, default: Date.now }  // Timestamp de quando o pedido foi feito
    }
  ],
  status: { type: String, default: 'emPreparo' },  // Status inicial é 'emPreparo'
  createdAt: { type: Date, default: Date.now },  // Data e hora do pedido
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
