import mongoose from "mongoose";

const UnitSchema = new mongoose.Schema({
    unitId: { 
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    unitName: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive']
    },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true })

const Unit = mongoose.model('Unit', UnitSchema);

export default Unit