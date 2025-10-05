import multer from "multer";

export const config = {
  api: { bodyParser: false }, // Vercel needs this for file uploads
};

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("photo");

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

  await new Promise((resolve, reject) =>
    upload(req, res, (err) => (err ? reject(err) : resolve()))
  );

  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const brand = "Sony";
  const product = "TV";
  const model = "Bravia-X90J";
  const manual = fetchManual(brand, product, model);

  res.status(200).json({ message: "Photo analysed successfully!", manual });
}
