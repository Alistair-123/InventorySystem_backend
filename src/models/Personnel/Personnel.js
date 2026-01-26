import mongoose from "mongoose";

const personnelSchema = new mongoose.Schema({
      personnelImage: {
        type: String, // relative path or filename
        required: false,
        trim: true
        },
    personnelId: { 
        type: String, 
        required: true, 
        unique: true,
         uppercase: true,
    },
    firstName: { 
        type: String, 
        required: true 
    },
    middleName: { 
        type: String 
    },
    lastName: { 
        type: String, 
        required: true 
    },
    personnelType: {
        type: String, 
        required: true, 
        enum: ['plantilla', 'jobOrder']
    },
    designationName: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        required: true, 
        enum: ['active', 'inactive'] 
    },

    password: { 
        type: String, 
        required: true 
    },    
    role: { 
        type: String, 
        enum: ['admin', 'user'], 
        default: 'user' 
    },

    refreshToken: { type: String },
    
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true })

const Personnel = mongoose.model("Personnel", personnelSchema);
export default Personnel;

