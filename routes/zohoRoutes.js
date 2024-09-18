const express = require("express");
const axios = require("axios");
const LeaveRequest = require("../models/LeaveRequest"); // Import the Mongoose model
const router = express.Router();

// Function to get a new access token
const getAccessToken = async () => {
  const refreshToken =
    "1000.01facd42e2dfd2c73f0b1a30f42c5fbc.765f303f3825070ca3610fb25d024579";
  const clientId = "1000.AFV0S9IGK7I6WQCZHLINW6G22L76FL";
  const clientSecret = "47acb15097d17899c4d957870984e9a39243c638bf";
  const url = "https://accounts.zoho.in/oauth/v2/token";

  const params = {
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
  };

  try {
    const response = await axios.post(url, null, { params });
    return response.data.access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error.response.data);
    throw new Error("Failed to refresh access token");
  }
};

// Function to format and clean data
const formatData = (record) => {
  return {
    department: record["Department"] || "Not found",
    insuranceCompany: record["Insurance_Company"] || "Not found",
    premium: record["PREMIUM"] || "Not found",
    insuranceType: record["Insurance_Type"] || "Not found",
    grossPremium: record["Gross_Premium"] || "Not found",
    employeeId: record["Employee_Id"] || "Not found",
    id: record["ID"] || "Not found",
    startDate: record["Start_Date"] || "Not found",
    endDate: record["End_Date"] || "Not found",
    carNumber: record["Car_Number"] || "Not found",
    reason: record["Reason"] || "Not found",
    typeOfLeave: record["Type_of_Leave"] || "Not found",
  };
};

// Route to fetch data from Zoho Creator API
router.get("/fetch-data", async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const url =
      "https://creator.zoho.in/api/v2/dev_it/my-first-project/report/All_Leave_Requests";
    const headers = {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json",
    };

    const response = await axios.get(url, { headers });
    const records = response.data.data;
    const formattedData = records.map(formatData);
    await LeaveRequest.insertMany(formattedData); // Save data to MongoDB

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data from Zoho Creator" });
  }
});

// Route to display the admin panel
router.get("/admin", async (req, res) => {
  try {
    const records = await LeaveRequest.find();
    res.render("admin", { records });
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).send("Failed to fetch records");
  }
});

// Route to handle editing records
router.get("/edit/:id", async (req, res) => {
  try {
    const recordId = req.params.id;
    const record = await LeaveRequest.findOne({ id: recordId }); // Use `id` field
    if (!record) {
      return res.status(404).send("Record not found");
    }
    res.render("edit", { record });
  } catch (error) {
    console.error("Error fetching record:", error);
    res.status(500).send("Error fetching record");
  }
});

// Route to handle updating records
router.post("/update/:id", async (req, res) => {
  try {
    const recordId = req.params.id;
    const updatedData = req.body;
    const result = await LeaveRequest.findOneAndUpdate(
      { id: recordId },
      updatedData,
      { new: true }
    );
    if (!result) {
      return res.status(404).send("Record not found");
    }
    res.redirect("/"); // Redirect to the home or list page
  } catch (error) {
    console.error("Error updating record:", error);
    res.status(500).send("Error updating record");
  }
});

// Route to handle deleting records
router.get("/delete/:id", async (req, res) => {
  try {
    const recordId = req.params.id;
    const result = await LeaveRequest.findOneAndDelete({ id: recordId }); // Use `id` field
    if (!result) {
      return res.status(404).send("Record not found");
    }
    res.redirect("/"); // Redirect to the home or list page
  } catch (error) {
    console.error("Error deleting record:", error);
    res.status(500).send("Error deleting record");
  }
});

module.exports = router;
