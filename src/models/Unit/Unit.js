import mongoose from "mongoose";

/* ---------- Counter ---------- */
const CounterSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  seq: { type: Number, default: 0 }
});

const Counter =
  mongoose.models.Counter ||
  mongoose.model("Counter", CounterSchema);


/* ---------- Unit Schema ---------- */
const UnitSchema = new mongoose.Schema({
  unitId: {
    type: String,
    unique: true,
    trim: true
  },
  unitName: {
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

/* ---------- Auto-generate Unit ID ---------- */
UnitSchema.pre("save", async function () {
  if (this.unitId) return;

  const counter = await Counter.findOneAndUpdate(
    { name: "unit" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  if (!counter) {
    throw new Error("Failed to generate unit ID");
  }

  this.unitId = `UNT-${String(counter.seq).padStart(3, "0")}`;
});

const Unit = mongoose.model("Unit", UnitSchema);
export default Unit;
