const express = require("express");
const multer = require("multer");
const cors = require("cors");
const Tesseract = require("tesseract.js");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Function to fetch manual URL
function fetchManual(brand, product, model) {
  return {
    brand,
    product,
    model,
    manualUrl: `https://example.com/manuals/${brand}_${product}_${model}.pdf`
  };
}

// Helper to analyze text with GPT
async function parseProductInfo(text) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Extract the brand, product type, and model number from this text. Return as comma-separated values (brand, product, model):\n\n${text}`
        }
      ]
    });

    const output = response.choices[0].message.content.trim();
    const [brand, product, model] = output.split(",").map(x => x.trim());
    return { brand, product, model };
  } catch (err) {
    console.error("Error parsing product info:", err);
    return null;
  }
}

// Route: Upload photo
app.post("/api/upload", upload.single("photo"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    // OCR to extract text
    const { data: { text } } = await Tesseract.recognize(req.file.buffer, "eng");

    // Parse brand/product/model via GPT
    const info = await parseProductInfo(text);

    const manual = info
      ? fetchManual(info.brand, info.product, info.model)
      : fetchManual("Sony", "TV", "Bravia-X90J"); // fallback

    res.json({ message: "Photo analysed successfully!", manual });
  } catch (err) {
    console.error(err);
    res.json({ message: "Failed to analyse photo", manual: fetchManual("Sony", "TV", "Bravia-X90J") });
  }
});

// Route: Camera photo (same logic as upload)
app.post("/api/camera", upload.single("photo"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No camera photo uploaded" });

  try {
    const { data: { text } } = await Tesseract.recognize(req.file.buffer, "eng");
    const info = await parseProductInfo(text);

    const manual = info
      ? fetchManual(info.brand, info.product, info.model)
      : fetchManual("Apple", "iPhone", "14 Pro"); // fallback

    res.json({ message: "Camera photo analysed!", manual });
  } catch (err) {
    console.error(err);
    res.json({ message: "Failed to analyse camera photo", manual: fetchManual("Apple", "iPhone", "14 Pro") });
  }
});

// Route: Manual input
app.post("/api/manual-input", (req, res) => {
  const { brand, product, model } = req.body;
  if (!brand || !product || !model) return res.status(400).json({ message: "All fields required" });
  res.json({ message: "Manual input processed!", manual: fetchManual(brand, product, model) });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
