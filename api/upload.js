import nextConnect from "next-connect";
import multer from "multer";
import { fetchManual, recognizeProductFromImage } from "./helpers";

const upload = multer({ storage: multer.memoryStorage() });
const handler = nextConnect();

handler.use(upload.single("photo"));

handler.post(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const productInfo = await recognizeProductFromImage(req.file.buffer);

  if (!productInfo) {
    return res.json({ message: "Could not recognize product. Returning default manual.", manual: fetchManual("Sony", "TV", "Bravia-X90J") });
  }

  const manual = fetchManual(productInfo.brand, productInfo.product, productInfo.model);
  res.json({ message: "Photo analysed successfully!", manual });
});

export const config = { api: { bodyParser: false } };
export default handler;
