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
UnitSchema.pre("save", async function (next) {
  if (this.unitId) return next();

  const counter = await Counter.findOneAndUpdate(
    { name: "unit" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.unitId = `UNT-${counter.seq
    .toString()
    .padStart(3, "0")}`;

  next();
});

const Unit = mongoose.model("Unit", UnitSchema);
export default Unit;
