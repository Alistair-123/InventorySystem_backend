import mongoose from "mongoose";

/* ---------- Counter ---------- */
const CounterSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  seq: { type: Number, default: 0 }
});

const Counter =
  mongoose.models.Counter ||
  mongoose.model("Counter", CounterSchema);


/* ---------- Office Schema ---------- */
const OfficeSchema = new mongoose.Schema({
  officeId: {
    type: String,
    unique: true,
    trim: true
  },
  officeName: {
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

/* ---------- Auto-generate Office ID ---------- */
OfficeSchema.pre("save", async function (next) {
  if (this.officeId) return next();

  const counter = await Counter.findOneAndUpdate(
    { name: "office" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.officeId = `OFF-${counter.seq
    .toString()
    .padStart(3, "0")}`;

  next();
});

const Office = mongoose.model("Office", OfficeSchema);
export default Office;
