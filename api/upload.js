import nextConnect from "next-connect";
import multer from "multer";
import { fetchManual } from "./helpers";

const upload = multer({ storage: multer.memoryStorage() });

const handler = nextConnect();

handler.use(upload.single("photo"));

handler.post((req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  // TODO: integrate AI/ML model later
  const manual = fetchManual("Sony", "TV", "Bravia-X90J");

  res.json({ message: "Photo analysed successfully!", manual });
});

export const config = {
  api: { bodyParser: false },
};

export default handler;
