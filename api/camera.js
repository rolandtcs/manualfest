const formidable = require('formidable');
const Tesseract = require('tesseract.js');

function fetchManual(brand, product, model) {
  return {
    brand: brand || "Unknown",
    product: product || "Unknown",
    model: model || "Unknown",
    manualUrl: `https://example.com/manuals/${brand}_${product}_${model}.pdf`
  };
}

function parseProductInfoSimple(text) {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  return {
    brand: lines[0] || "Unknown Brand",
    product: lines[1] || "Unknown Product",
    model: lines[2] || "Unknown Model"
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const form = formidable({ 
      maxFileSize: 10 * 1024 * 1024,
      keepExtensions: true 
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parse error:', err);
        return res.status(500).json({ 
          message: "Error parsing file",
          error: err.message 
        });
      }

      const file = files.photo;
      if (!file || !file[0]) {
        return res.status(400).json({ message: "No camera photo uploaded" });
      }

      try {
        const { data: { text } } = await Tesseract.recognize(file[0].filepath, 'eng');
        const info = parseProductInfoSimple(text);
        const manual = fetchManual(info.brand, info.product, info.model);

        return res.status(200).json({ 
          message: "Camera photo analysed!", 
          manual,
          extractedText: text.substring(0, 200)
        });
        
      } catch (ocrError) {
        console.error('OCR Error:', ocrError);
        return res.status(200).json({
          message: "Could not read text from image",
          manual: fetchManual("Apple", "iPhone", "14 Pro")
        });
      }
    });
    
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};