import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    tableNumber: { type: Number, required: true, unique: true },  // Número único da mesa
    status: { type: String, enum: ['livre', 'ocupada', 'aguardando pagamento'], default: 'livre' },  // Status da mesa  
    updatedAt: { type: Date }  // Registra quando o status da mesa foi atualizado
  }, { timestamps: true });

export default mongoose.model('Table', tableSchema);
