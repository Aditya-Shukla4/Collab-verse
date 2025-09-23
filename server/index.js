const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test Route ko import karne ke liye
const testRoutes = require("./src/routes/test.routes");

app.use("/api/test", testRoutes);

// starting server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
