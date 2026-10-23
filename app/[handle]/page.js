import Link from "next/link";
import clientPromise from "@/lib/mongodb";
import { notFound } from "next/navigation";

export default async function ProfilePage({ params }) {
  const { handle: rawHandle } = await params;
  const handle = decodeURIComponent(rawHandle).toLowerCase();
  if (!/^[a-z0-9_-]{3,24}$/.test(handle)) notFound();

  let item;
  try {
    const client = await clientPromise;
    item = await client.db("bittree").collection("links").findOne({ handle });
  } catch (error) {
    console.error("Unable to load public profile:", error.message);
    throw error;
  }
  if (!item) notFound();

  return (
    <main className="profile-page">
      <section className="public-profile">
        {item.pic ? <img className="preview-avatar" src={item.pic} alt={`${item.handle}'s profile`} /> : <div className="preview-avatar">{item.handle.charAt(0).toUpperCase()}</div>}
        <h1>{item.handle}</h1><p className="profile-handle">@{item.handle}</p>
        {item.desc && <p className="preview-description">{item.desc}</p>}
        {(Array.isArray(item.links) ? item.links : []).map((link, index) => {
          let safeUrl;
          try { safeUrl = new URL(link.link); } catch { return null; }
          if (!["http:", "https:"].includes(safeUrl.protocol)) return null;
          return <a className="live-link" key={`${link.linktext}-${index}`} href={safeUrl.toString()} target="_blank" rel="noopener noreferrer">{link.linktext || safeUrl.hostname}<span style={{ float: "right" }}>↗</span></a>;
        })}
        <p className="profile-footer">One page. All your places. · <Link href="/">Make your own Bittree</Link></p>
      </section>
    </main>
  );
}
