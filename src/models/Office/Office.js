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
OfficeSchema.pre("save", async function () {
  if (this.officeId) return;

  const counter = await Counter.findOneAndUpdate(
    { name: "office" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  if (!counter) {
    throw new Error("Failed to generate office ID");
  }

  this.officeId = `OFF-${String(counter.seq).padStart(3, "0")}`;
});


const Office = mongoose.model("Office", OfficeSchema);
export default Office;
