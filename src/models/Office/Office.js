import mongoose from "mongoose";

const OfficeSchema = new mongoose.Schema({
    officeId: { 
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    officeName: {
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

const Office = mongoose.model('Office', OfficeSchema);

export default Office