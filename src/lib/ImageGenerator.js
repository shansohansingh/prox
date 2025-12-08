import OpenAI from "openai";

const client = new OpenAI({
  baseURL: process.env.NEBIUS_API_URL,
  apiKey: process.env.NEBIUS_API_KEY,
});

export const ImageGenerator = async (prompt) => {
  try {
    if (!process.env.NEBIUS_API_KEY) {
      throw { error: "OpenAI API key is not configured", status: 500 };
    }

    const response = await client.images.generate({
      model: "black-forest-labs/flux-dev",
      response_format: "url",
      prompt: prompt,
    });

    const imageUrl = response?.data?.[0]?.url;
    return imageUrl;
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
};
