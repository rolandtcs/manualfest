import { Configuration, OpenAIApi } from "openai";

export function fetchManual(brand, product, model) {
  return { brand, product, model, manualUrl: `https://example.com/manuals/${brand}_${product}_${model}.pdf` };
}

// Setup OpenAI client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Recognize product from image buffer
export async function recognizeProductFromImage(buffer) {
  try {
    const base64Image = buffer.toString("base64");
    const prompt = `
      Detect the brand, product type, and model number from this image.
      Return only JSON in the format:
      { "brand": "...", "product": "...", "model": "..." }
    `;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "user", content: prompt },
        { role: "user", content: { type: "input_image", image: base64Image } }
      ]
    });

    const outputText = response.output[0].content[0].text;
    return JSON.parse(outputText);
  } catch (err) {
    console.error("OpenAI recognition error:", err);
    return null;
  }
}
