const express = require("express");
const dotenv = require("dotenv");
const connectdb = require("./dbconnect");
const authRouter = require("./routes/authRouter");
const adminRouter = require("./routes/adminRouter");
const getRouter = require("./routes/getRouter");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cron = require("node-cron");
const removeOrdersWithPendingStatus = require("./utils/removeOrdersWithPendingStatus");
const updateForTopPick = require("./utils/updateForTopPick");

const cloudinary = require("cloudinary").v2;
const app = express();

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
cron.schedule("0 0 * * *", () => {
  updateForTopPick();
});

cron.schedule("0 1 * * 0", () => {
  removeOrdersWithPendingStatus();
});

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/api", getRouter);

app.get("/", (req, res) => {
  res.json({ server: "started" });
});

const PORT = process.env.PORT;
connectdb();
app.listen(PORT, () => {
  console.log(`Server is listening at ${PORT}`);
});
