import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    /* Property No. (typed from frontend) */
    propertyNo: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    /* Item Name (dropdown → Items) */
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Items",
      required: true
    },

    /* Acquisition Date */
    acquisitionDate: {
      type: Date,
      required: true
    },

    /* Acquisition Name (dropdown → AcquisitionType) */
    acquisitionType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcquisitionType",
      required: true
    },

    /* Acquisition Value */
    acquisitionValue: {
      type: Number,
      required: true,
      min: 0
    },

    /* Personnel Name (dropdown → Personnel) */
    personnel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Personnel",
      required: true
    },

    /* Office Name (dropdown → Office) */
    office: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Office",
      required: true
    },

    /* Property Status */
    status: {
      type: String,
      enum: ["serviceable", "unserviceable", "disposed", "lost"],
      default: "serviceable"
    }
  },
  { timestamps: true }
);

const Property =
  mongoose.models.Property ||
  mongoose.model("Property", PropertySchema);

export default Property;
