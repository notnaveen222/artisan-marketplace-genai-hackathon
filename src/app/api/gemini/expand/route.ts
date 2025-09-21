import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name = "",
      category = "",
      price = "",
      description = "",
    } = body || {};

    const prompt = `
Expand the following handmade product into a polished, engaging listing.
Keep it concise (120–180 words), benefit-led, and trustworthy.
Use only provided info—don't invent specs.

Name: ${name || "N/A"}
Category: ${category || "N/A"}
Price: ${price || "N/A"}
Base description: ${description || "N/A"}

Write:
1) A compelling product description paragraph.
2) 4 short bullet points (no trailing punctuation).
`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey)
      return new NextResponse("Missing GEMINI_API_KEY", { status: 500 });

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!res.ok) {
      const errTxt = await res.text();
      return new NextResponse(errTxt || "Gemini call failed", {
        status: res.status,
      });
    }

    const data = await res.json();
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p?.text || "")
        .join("\n")
        .trim() || "";

    return NextResponse.json({ text });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Server error";
    return new NextResponse(errorMessage, { status: 500 });
  }
}
