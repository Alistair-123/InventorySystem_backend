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
BrandSchema.pre("save", async function (next) {
  if (this.brandId) return next();

  const counter = await Counter.findOneAndUpdate(
    { name: "brand" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.brandId = `BRD-${counter.seq
    .toString()
    .padStart(3, "0")}`;

  next();
});

const Brand = mongoose.model("Brand", BrandSchema);
export default Brand;
