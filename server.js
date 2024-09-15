const express = require("express");
const { connectToDatabase } = require("./config/db");
const app = express();
require("dotenv").config({ path: ".env" });
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const recordRoutes = require("./routes/recordRoutes");
app.set("json spaces", 5);
app.use(cors());

const port = process.env.PORT || 5000;

app.use(express.json());


app.get("/api/v1/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/record", recordRoutes);

connectToDatabase();

app.use((req, res, next) => {
  const error = new Error('Endpoint not found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
      message: 'Internal Server Error',
      error: err.message,
      success: false
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
