import mongoose from "mongoose";

const BusinessMemberSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,

    businessCategory: String,

    services: [String],

    location: String,

    description: String,

    status: {
      type: String,
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "BusinessMember",
  BusinessMemberSchema
);