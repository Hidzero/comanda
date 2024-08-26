import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    }
},
{
    timestamps: true
});

export default mongoose.model("inventory", inventorySchema);
