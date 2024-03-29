const express = require("express");
const dotenv = require("dotenv");
const connectdb = require("./dbconnect");
const authRouter = require("./routes/authRouter");
const adminRouter = require("./routes/adminRouter");
const getRouter = require("./routes/getRouter");
const cors = require("cors");

var cloudinary = require("cloudinary").v2;
const app = express();

dotenv.config("./env");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json({ limit: "10mb" }));
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
