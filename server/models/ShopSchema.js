import mongoose from "mongoose";
const ShopSchema = mongoose.Schema({
  domain: String,
  password: String,
  scope: String,
  installedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Shop", ShopSchema);
