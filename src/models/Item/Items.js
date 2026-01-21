import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  seq: { type: Number, default: 0 }
});

const Counter =
  mongoose.models.Counter ||
  mongoose.model("Counter", CounterSchema);

const ItemsSchema = new mongoose.Schema({
  itemImage: {
  type: String, // relative path or filename
  required: false,
  trim: true
},

  itemId: {
    type: String,
    unique: true,
    trim: true
  },

  itemName: {
    type: String,
    required: true,
    trim: true
  },

  itemDescription: {
    type: String,
    trim: true
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true
  },

  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Unit",
    required: true
  }

}, { timestamps: true });

ItemsSchema.pre("save", async function () {
  if (this.itemId) return ;

  const counter = await Counter.findOneAndUpdate(
    { name: "items" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  if (!counter) {
    return new Error("Failed to generate item ID");
  }

  this.itemId = `ITEM-${String(counter.seq).padStart(5, "0")}`;
  ;
});

const Items =
  mongoose.models.Items ||
  mongoose.model("Items", ItemsSchema);

export default Items;

