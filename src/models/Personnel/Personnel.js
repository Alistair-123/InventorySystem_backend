import mongoose from "mongoose";
import bcrypt from "bcryptjs";
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

// ✅ Auto-hash password on save
personnelSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// ✅ comparePassword method
personnelSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Personnel = mongoose.model("Personnel", personnelSchema);
export default Personnel;

