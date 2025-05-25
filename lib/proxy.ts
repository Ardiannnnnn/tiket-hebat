// lib/proxy.ts
import type { NextApiRequest, NextApiResponse } from "next";

const BASE_URL =
  "https://tikethebat.ambitiousflower-0b7495d3.southeastasia.azurecontainerapps.io";
const API_PREFIX = "/api/v1";

export async function proxyRequest(
  req: NextApiRequest,
  res: NextApiResponse,
  backendPath: string
) {
  const backendUrl = `${BASE_URL}${API_PREFIX}${backendPath}`;

  try {
    // Ambil token dari cookie atau header Authorization
    const accessToken = req.headers.authorization; // biasanya: 'Bearer <token>'
    const refreshTokenCookie = req.headers.cookie; // asumsikan refresh token di cookie httpOnly

    const proxyHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Cookie: refreshTokenCookie || "",
    };

    if (accessToken) {
      proxyHeaders["Authorization"] = accessToken;
    }

    // Jika methodnya POST, PUT, PATCH, teruskan body JSON
    const body =
      ["POST", "PUT", "PATCH"].includes(req.method || "") &&
      req.body &&
      Object.keys(req.body).length > 0
        ? JSON.stringify(req.body)
        : undefined;

    const backendRes = await fetch(backendUrl, {
      method: req.method,
      headers: proxyHeaders,
      body,
    });

    // Teruskan semua set-cookie dari backend (misal ada update token di cookie)
    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) {
      // Jika ada beberapa cookie dalam satu header, pisahkan menjadi array
      const cookies = setCookie.split(",").map((c) => c.trim());
      res.setHeader("Set-Cookie", cookies);
    }

    // Teruskan status dan response body
    const text = await backendRes.text();
    res.status(backendRes.status).send(text);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
