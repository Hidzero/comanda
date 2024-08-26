import mongoose from "mongoose";

const cashRegisterSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    openingBalance: {
        type: Number,
        required: true,
    },
    closingBalance: {
        type: Number,
        required: true,
    },
    totalSales: {
        type: Number,
        required: true,
    },
},
{
    timestamps: true
});

export default mongoose.model("cashRegister", cashRegisterSchema);
