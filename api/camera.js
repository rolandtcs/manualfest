import multer from "multer";
import nextConnect from "next-connect";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const handler = nextConnect();

function fetchManual(brand, product, model) {
  return {
    brand,
    product,
    model,
    manualUrl: `https://example.com/manuals/${brand}_${product}_${model}.pdf`,
  };
}

handler.use(upload.single("photo"));

handler.post((req, res) => {
  if (!req.file) return res.status(400).json({ message: "No camera photo uploaded" });

  const brand = "Apple";
  const product = "iPhone";
  const model = "14 Pro";
  const manual = fetchManual(brand, product, model);

  res.json({ message: "Camera photo analysed!", manual });
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
