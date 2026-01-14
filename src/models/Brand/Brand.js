import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema({
    brandId: { 
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    brandName: {
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

const Brand = mongoose.model('Category', BrandSchema);

export default Brand