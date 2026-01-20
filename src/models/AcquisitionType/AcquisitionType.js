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
AcquisitionTypeSchema.pre("save", async function (next) {
  if (this.acquisitionTypeId) return next();

  const counter = await Counter.findOneAndUpdate(
    { name: "acquisitionType" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.acquisitionTypeId = `ACQ-${counter.seq
    .toString()
    .padStart(3, "0")}`;

  next();
});

const AcquisitionType = mongoose.model(
  "AcquisitionType",
  AcquisitionTypeSchema
);

export default AcquisitionType;
