import { fetchManual } from "./helpers";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { brand, product, model } = req.body;
  if (!brand || !product || !model) return res.status(400).json({ message: "All fields are required" });

  const manual = fetchManual(brand, product, model);
  res.json({ message: "Manual input processed!", manual });
}