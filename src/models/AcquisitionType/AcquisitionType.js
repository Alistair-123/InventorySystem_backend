import mongoose from "mongoose";

/* -------- Counter Model (same file, allowed) -------- */
const CounterSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  seq: { type: Number, default: 0 }
});

const Counter =
  mongoose.models.Counter ||
  mongoose.model("Counter", CounterSchema);


/* -------- Main Schema -------- */
const AcquisitionTypeSchema = new mongoose.Schema({
  acquisitionTypeId: {
    type: String,
    unique: true,
    trim: true
  },
  acquisitionTypeName: {
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

/* -------- Auto-generate ID -------- */
AcquisitionTypeSchema.pre("save", async function () {
  if (this.acquisitionTypeId) return;

  const counter = await Counter.findOneAndUpdate(
    { name: "acquisitionType" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  if (!counter) {
    throw new Error("Failed to generate acquisition type ID");
  }

  this.acquisitionTypeId = `ACQ-${String(counter.seq).padStart(3, "0")}`;
});


const AcquisitionType = mongoose.model(
  "AcquisitionType",
  AcquisitionTypeSchema
);

export default AcquisitionType;
