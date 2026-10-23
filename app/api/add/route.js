import clientPromise from "@/lib/mongodb";

const HANDLE_PATTERN = /^[a-z0-9_-]{3,24}$/;
const json = (body, status = 200) => Response.json(body, { status });

export async function POST(request) {
  let body;
  try { body = await request.json(); }
  catch { return json({ success: false, message: "Request body must be valid JSON." }, 400); }

  const handle = typeof body.handle === "string" ? body.handle.trim().toLowerCase().replace(/^@/, "") : "";
  const desc = typeof body.desc === "string" ? body.desc.trim().slice(0, 240) : "";
  const pic = typeof body.pic === "string" ? body.pic.trim().slice(0, 2048) : "";
  if (!HANDLE_PATTERN.test(handle)) return json({ success: false, message: "Handle must be 3–24 characters using letters, numbers, hyphens, or underscores." }, 400);
  if (pic) {
    try { const url = new URL(pic); if (!["http:", "https:"].includes(url.protocol)) throw new Error(); }
    catch { return json({ success: false, message: "Profile image must be a valid HTTP or HTTPS URL." }, 400); }
  }
  if (!Array.isArray(body.links) || body.links.length < 1 || body.links.length > 12) {
    return json({ success: false, message: "Add between 1 and 12 links." }, 400);
  }

  const links = [];
  for (const entry of body.links) {
    const linktext = typeof entry?.linktext === "string" ? entry.linktext.trim().slice(0, 60) : "";
    const rawLink = typeof entry?.link === "string" ? entry.link.trim() : "";
    if (!linktext || !rawLink) return json({ success: false, message: "Every link needs both a title and a URL." }, 400);
    let url;
    try { url = new URL(rawLink); }
    catch { return json({ success: false, message: `Invalid URL for "${linktext}".` }, 400); }
    if (!["http:", "https:"].includes(url.protocol)) return json({ success: false, message: "Only HTTP and HTTPS links are allowed." }, 400);
    links.push({ linktext, link: url.toString() });
  }

  try {
    const client = await clientPromise;
    const collection = client.db("bittree").collection("links");
    const result = await collection.updateOne(
      { handle },
      { $setOnInsert: { handle, pic, desc, links, createdAt: new Date() } },
      { upsert: true }
    );
    if (!result.upsertedCount) return json({ success: false, message: "That handle is already taken. Try another one." }, 409);
    return json({ success: true, message: "Your Bittree has been published.", handle }, 201);
  } catch (error) {
    if (error?.code === 11000) return json({ success: false, message: "That handle is already taken. Try another one." }, 409);
    console.error("Profile creation failed:", error);
    return json({ success: false, message: "Could not publish your page. Check the database connection and try again." }, 500);
  }
}
