function fetchManual(brand, product, model) {
  return {
    brand,
    product,
    model,
    manualUrl: `https://example.com/manuals/${brand}_${product}_${model}.pdf`,
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { brand, product, model } = req.body;
  if (!brand || !product || !model)
    return res.status(400).json({ message: "All fields are required." });

  const manual = fetchManual(brand, product, model);
  res.status(200).json({ message: "Manual input processed!", manual });
}
