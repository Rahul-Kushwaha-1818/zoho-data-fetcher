const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema({
  department: String,
  insuranceCompany: String,
  premium: String,
  insuranceType: String,
  grossPremium: String,
  employeeId: { type: String, unique: true },
  id: { type: String, unique: true }, // Use `id` as the unique field
  startDate: String,
  endDate: String,
  carNumber: String,
  reason: String,
  typeOfLeave: String,
});

const LeaveRequest = mongoose.model("LeaveRequest", leaveRequestSchema);

module.exports = LeaveRequest;
