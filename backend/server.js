const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

const storage = multer.memoryStorage();
const upload = multer({ storage });

function fetchManual(brand, product, model) {
  return {
    brand,
    product,
    model,
    manualUrl: `https://example.com/manuals/${brand}_${product}_${model}.pdf`,
  };
}

app.post("/upload", upload.single("photo"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  const brand = "Sony";
  const product = "TV";
  const model = "Bravia-X90J";
  const manual = fetchManual(brand, product, model);
  res.json({ message: "Photo analysed successfully!", manual });
});

app.post("/manual-input", (req, res) => {
  const { brand, product, model } = req.body;
  if (!brand || !product || !model)
    return res.status(400).json({ message: "All fields are required." });
  const manual = fetchManual(brand, product, model);
  res.json({ message: "Manual input processed!", manual });
});

app.post("/camera", upload.single("photo"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No camera photo uploaded" });
  const brand = "Apple";
  const product = "iPhone";
  const model = "14 Pro";
  const manual = fetchManual(brand, product, model);
  res.json({ message: "Camera photo analysed!", manual });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
