import mongoose from "mongoose";

const AcquisitionTypeSchema = new mongoose.Schema({
    acquisitionTypeId: { 
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    acquisitionTypeName: {
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

const AcquisitionType = mongoose.model('AcquisitionType', AcquisitionTypeSchema);

export default AcquisitionType