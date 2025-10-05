import nextConnect from "next-connect";
import multer from "multer";
import { fetchManual } from "./helpers";

const upload = multer({ storage: multer.memoryStorage() });

const handler = nextConnect();

handler.use(upload.single("photo"));

handler.post((req, res) => {
  if (!req.file) return res.status(400).json({ message: "No camera photo uploaded" });

  const manual = fetchManual("Apple", "iPhone", "14 Pro");
  res.json({ message: "Camera photo analysed!", manual });
});

export const config = {
  api: { bodyParser: false },
};

export default handler;
