import mongoose from "mongoose";

const personnelSchema = new mongoose.Schema({
    personnelId: { 
        type: String, 
        required: true, 
        unique: true 
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
    designation: { 
        type: String, 
        required: true 
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

