import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    categoryId: {
        type: String,
        required: true,
        unique: true
    },
    categoryName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });
const Category = mongoose.model('Category', CategorySchema);
export default Category;