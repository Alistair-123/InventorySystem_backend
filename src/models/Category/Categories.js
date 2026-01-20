import mongoose from "mongoose";

/* ---------- Counter ---------- */
const CounterSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  seq: { type: Number, default: 0 }
});

const Counter =
  mongoose.models.Counter ||
  mongoose.model("Counter", CounterSchema);


/* ---------- Category Schema ---------- */
const CategorySchema = new mongoose.Schema({
  categoryId: {
    type: String,
    unique: true,
    trim: true
  },
  categoryName: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive"]
  }
}, { timestamps: true });

/* ---------- Auto-generate Category ID ---------- */
CategorySchema.pre("save", async function (next) {
  if (this.categoryId) return next();

  const counter = await Counter.findOneAndUpdate(
    { name: "category" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.categoryId = `CAT-${counter.seq
    .toString()
    .padStart(3, "0")}`;

  next();
});

const Category = mongoose.model("Category", CategorySchema);
export default Category;
