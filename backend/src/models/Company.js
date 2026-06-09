import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: String,
  description: String,
  services: [String],
  email: String,
  phone: String
});

const Company = mongoose.model(
  "Company",
  companySchema
);

export default Company;