const express = require("express");
const multer = require("multer");
const cors = require("cors");
const serverless = require("serverless-http"); // <-- important

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Dummy function to return manual
function fetchManual(brand, product, model) {
  return {
    brand,
    product,
    model,
    manualUrl: `https://example.com/manuals/${brand}_${product}_${model}.pdf`,
  };
}

// Routes
app.post("/api/upload", upload.single("photo"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({
    message: "Photo analysed successfully!",
    manual: fetchManual("Sony", "TV", "Bravia-X90J"),
  });
});

app.post("/api/manual-input", (req, res) => {
  const { brand, product, model } = req.body;
  if (!brand || !product || !model)
    return res.status(400).json({ message: "All fields required" });
  res.json({
    message: "Manual input processed!",
    manual: fetchManual(brand, product, model),
  });
});

app.post("/api/camera", upload.single("photo"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "No camera photo uploaded" });
  res.json({
    message: "Camera photo analysed!",
    manual: fetchManual("Apple", "iPhone", "14 Pro"),
  });
});

// -----------------------------
// Do NOT use app.listen() on Vercel
// Export handler for serverless
module.exports = app;
module.exports.handler = serverless(app);
