//================================================================================
//src / app.js;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes"); // Import user routes
const dealerRoutes = require("./routes/dealershipRoutes");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

// Admin routes
app.use("/admin", adminRoutes);

// user routes
app.use("/user", userRoutes);

//dealer routes
app.use("/dealer", dealerRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//================================================================================
