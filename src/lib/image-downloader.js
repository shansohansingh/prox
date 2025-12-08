import { Slugify } from "@/contexts/CallBack";
import axios from "axios";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { pipeline } from "stream";
import { promisify } from "util";

const streamPipeline = promisify(pipeline);

export async function downloadImageFromUrl(
  imageUrl,
  saveDir = "public/generated"
) {
  try {
    const response = await axios.get(imageUrl, { responseType: "stream" });

    const timestamp = Date.now();
    const rawFilename = `image-${timestamp}.webp`;
    const sanitizedFilename = Slugify(rawFilename);
    const savePath = path.join(saveDir, sanitizedFilename);

    fs.mkdirSync(saveDir, { recursive: true });

    // Convert to .webp using sharp
    const transformer = sharp().webp();
    await streamPipeline(
      response.data,
      transformer,
      fs.createWriteStream(savePath)
    );

    const baseUrl = process.env.BASE_URL;
    const imageUrlPublic = `${baseUrl}/generated-images/${sanitizedFilename}`;

    return imageUrlPublic;
  } catch (error) {
    console.error("Image download error:", error.message);
    throw new Error("Image download failed");
  }
}
