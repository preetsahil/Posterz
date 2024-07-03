const express = require("express");
const dotenv = require("dotenv");
const connectdb = require("./dbconnect");
const authRouter = require("./routes/authRouter");
const adminRouter = require("./routes/adminRouter");
const getRouter = require("./routes/getRouter");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const removeOrdersWithPendingStatus = require("./utils/removeOrdersWithPendingStatus");
const updateForTopPick = require("./utils/updateForTopPick");

const cloudinary = require("cloudinary").v2;
const app = express();
const allowedOrigins = [process.env.CORS_ORIGIN, "http://localhost:5173"];
dotenv.config("./env");
app.use(
  cors({
    origin: [process.env.CORS_ORIGIN, "http://localhost:5173"],
    credentials: true,
  })
);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/api", getRouter);
app.get("/cron/toppick", async (req, res) => {
  try {
    await updateForTopPick();
    res.status(200).send("Update for top pick completed");
  } catch (error) {
    res.status(500).send("Error updating top pick");
  }
});
app.get("/cron/removependingorder", async (req, res) => {
  try {
    await removeOrdersWithPendingStatus();
    res.status(200).send("Removed pending orders");
  } catch (error) {
    res.status(500).send("Error removing pending orders");
  }
});

app.get("/", (req, res) => {
  res.json({ server: "started" });
});

const PORT = process.env.PORT;
connectdb();
app.listen(PORT, () => {
  console.log(`Server is listening at ${PORT}`);
});
