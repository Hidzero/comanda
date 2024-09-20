import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  combo_name: { type: String },  // Apenas para os combos
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String, required: true },  // Categoria (combo, porção, bebida, etc.)
});

export default mongoose.model('Product', productSchema);

