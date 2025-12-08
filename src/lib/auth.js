import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function getTokenFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  return token;
}

export async function getUserIdFromToken() {
  const token = await getTokenFromCookies();
  try {
    const decoded = jwt.decode(token, JWT_SECRET);

    return decoded.userId;
  } catch (err) {
    throw new Error("Invalid token");
  }
}
