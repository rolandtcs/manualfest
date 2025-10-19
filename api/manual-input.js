function fetchManual(brand, product, model) {
  return {
    brand: brand || "Unknown",
    product: product || "Unknown",
    model: model || "Unknown",
    manualUrl: `https://example.com/manuals/${brand}_${product}_${model}.pdf`
  };
}

export default async function handler(req, res) {
  // Enable CORS
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
    const { brand, product, model } = req.body;
    
    if (!brand || !product || !model) {
      return res.status(400).json({ 
        message: "All fields required",
        received: { brand, product, model }
      });
    }

    const manual = fetchManual(brand, product, model);
    
    return res.status(200).json({ 
      message: "Manual input processed!", 
      manual 
    });
    
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
}