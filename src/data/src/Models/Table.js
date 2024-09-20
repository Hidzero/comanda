import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    tableNumber: { type: Number, required: true, unique: true },  // Número único da mesa
    status: { type: String, enum: ['livre', 'ocupada', 'aguardando pagamento'], default: 'livre' },  // Status da mesa  
}, { timestamps: true });

export default mongoose.model('Table', tableSchema);
