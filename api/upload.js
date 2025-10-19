const formidable = require('formidable');
const Tesseract = require('tesseract.js');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function fetchManual(brand, product, model) {
  return {
    brand,
    product,
    model,
    manualUrl: `https://example.com/manuals/${brand}_${product}_${model}.pdf`
  };
}

async function parseProductInfo(text) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: "user",
        content: `Extract brand, product type, and model from this text. Return ONLY as: brand,product,model\n\n${text}`
      }]
    });

    const output = response.choices[0].message.content.trim();
    const [brand, product, model] = output.split(",").map(x => x.trim());
    return { brand, product, model };
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const form = formidable({ maxFileSize: 10 * 1024 * 1024 });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: "Error parsing file" });
    }

    const file = files.photo;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const { data: { text } } = await Tesseract.recognize(file[0].filepath, "eng");
      const info = await parseProductInfo(text);

      const manual = info
        ? fetchManual(info.brand, info.product, info.model)
        : fetchManual("Sony", "TV", "Bravia-X90J");

      res.json({ message: "Photo analysed successfully!", manual });
    } catch (error) {
      console.error(error);
      res.json({
        message: "Failed to analyse photo",
        manual: fetchManual("Sony", "TV", "Bravia-X90J")
      });
    }
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};