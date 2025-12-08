import { getTokenFromCookies } from "@/lib/auth";

export async function GET() {
  const token = await getTokenFromCookies();

  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  return new Response(JSON.stringify({ token }), { status: 200 });
}
