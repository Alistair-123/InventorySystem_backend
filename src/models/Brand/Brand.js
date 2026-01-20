import mongoose from "mongoose";

/* ---------- Counter (shared pattern) ---------- */
const CounterSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  seq: { type: Number, default: 0 }
});

const Counter =
  mongoose.models.Counter ||
  mongoose.model("Counter", CounterSchema);


/* ---------- Brand Schema ---------- */
const BrandSchema = new mongoose.Schema({
  brandId: {
    type: String,
    unique: true,
    trim: true
  },
  brandName: {
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

/* ---------- Auto-generate Brand ID ---------- */
BrandSchema.pre("save", async function () {
  if (this.brandId) return;

  const counter = await Counter.findOneAndUpdate(
    { name: "brand" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  if (!counter) {
    throw new Error("Failed to generate brand ID");
  }

  this.brandId = `BRD-${String(counter.seq).padStart(3, "0")}`;
});


const Brand = mongoose.model("Brand", BrandSchema);
export default Brand;
