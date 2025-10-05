export default function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { brand, product, model } = req.body;
  if (!brand || !product || !model)
    return res.status(400).json({ message: "All fields are required." });

  const manual = {
    brand,
    product,
    model,
    manualUrl: `https://example.com/manuals/${brand}_${product}_${model}.pdf`,
  };

  res.json({ message: "Manual input processed!", manual });
}
