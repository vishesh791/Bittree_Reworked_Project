"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Builder() {
  const searchParams = useSearchParams();
  const [handle, setHandle] = useState((searchParams.get("handle") || "").replace(/^@/, "").toLowerCase());
  const [pic, setPic] = useState("");
  const [desc, setDesc] = useState("");
  const [links, setLinks] = useState([{ linktext: "", link: "" }]);
  const [saving, setSaving] = useState(false);

  const validLinks = useMemo(() => links.filter((item) => item.linktext.trim() && item.link.trim()), [links]);

  function updateLink(index, field, value) {
    setLinks((current) => current.map((item, i) => i === index ? { ...item, [field]: value } : item));
  }
  function addLink() {
    if (links.length >= 12) return toast.info("You can add up to 12 links.");
    setLinks((current) => [...current, { linktext: "", link: "" }]);
  }
  function removeLink(index) {
    setLinks((current) => current.length === 1 ? [{ linktext: "", link: "" }] : current.filter((_, i) => i !== index));
  }
  async function submitLinks(event) {
    event.preventDefault();
    const normalizedHandle = handle.trim().toLowerCase().replace(/^@/, "");
    if (!/^[a-z0-9_-]{3,24}$/.test(normalizedHandle)) return toast.error("Handle must be 3–24 characters using letters, numbers, _ or -.");
    if (!validLinks.length) return toast.error("Add at least one link with both a title and URL.");
    for (const item of validLinks) {
      try {
        const url = new URL(item.link.startsWith("http://") || item.link.startsWith("https://") ? item.link : `https://${item.link}`);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error();
      } catch { return toast.error(`Please enter a valid URL for "${item.linktext}".`); }
    }
    setSaving(true);
    try {
      const response = await fetch("/api/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: normalizedHandle, pic: pic.trim(), desc: desc.trim(), links: validLinks.map((item) => ({ linktext: item.linktext.trim(), link: item.link.trim().match(/^https?:\/\//) ? item.link.trim() : `https://${item.link.trim()}` })) }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Could not create your page.");
      toast.success("Your Bittree is live!");
      window.location.assign(`/${encodeURIComponent(normalizedHandle)}`);
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="builder-page">
      <div className="builder-heading"><p className="eyebrow">A FEW DETAILS, THEN YOU&apos;RE LIVE</p><h1>Build your little corner of the web.</h1><p>Choose your handle, add your links, and see the profile take shape as you go.</p></div>
      <div className="builder-layout">
        <form className="builder-panel" onSubmit={submitLinks}>
          <h2>01 / Your identity</h2>
          <label className="field-label" htmlFor="handle">Public handle</label>
          <input id="handle" className="form-input" value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="yourname" maxLength={24} required />
          <label className="field-label" htmlFor="pic">Profile image URL (optional)</label>
          <input id="pic" className="form-input" type="url" value={pic} onChange={(e) => setPic(e.target.value)} placeholder="https://example.com/photo.jpg" />
          <label className="field-label" htmlFor="desc">A short introduction</label>
          <textarea id="desc" className="form-input" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What should people know about you?" maxLength={240} rows={3} />

          <h2>02 / Your links</h2>
          {links.map((item, index) => <div className="link-editor" key={index}>
            <input className="form-input" aria-label={`Link ${index + 1} title`} value={item.linktext} onChange={(e) => updateLink(index, "linktext", e.target.value)} placeholder="Link title" />
            <input className="form-input" aria-label={`Link ${index + 1} URL`} value={item.link} onChange={(e) => updateLink(index, "link", e.target.value)} placeholder="https://..." />
            <button type="button" className="remove-link" onClick={() => removeLink(index)} aria-label={`Remove link ${index + 1}`}>×</button>
          </div>)}
          <div className="builder-actions"><button className="button button-outline" type="button" onClick={addLink}>+ Add a link</button><button className="button button-dark" type="submit" disabled={saving}>{saving ? "Publishing…" : "Publish my page"} <span>↗</span></button></div>
          <p className="builder-note">Handles are public and unique. Only add links you want other people to visit. You can use up to 12 links.</p>
        </form>

        <aside className="live-preview">
          <p className="preview-label">LIVE PREVIEW</p>
          {pic ? <img className="preview-avatar" src={pic} alt="Profile preview" onError={(e) => { e.currentTarget.style.display = "none"; }} /> : <div className="preview-avatar">{(handle || "b").charAt(0).toUpperCase()}</div>}
          <h3>{handle ? `@${handle.replace(/^@/, "")}` : "@yourname"}</h3>
          <p className="preview-description">{desc || "Your short introduction will appear here. Keep it personal and make it yours."}</p>
          {(validLinks.length ? validLinks : [{ linktext: "Your first link", link: "" }]).map((item, index) => <div className="live-link" key={`${item.linktext}-${index}`}>{item.linktext || "Untitled link"} <span style={{ float: "right" }}>↗</span></div>)}
          <p className="profile-footer">A little page made with Bittree ✳</p>
        </aside>
      </div>
      <ToastContainer position="bottom-right" />
    </main>
  );
}

export default function GeneratePage() {
  return <Suspense fallback={<main className="builder-page">Loading your builder…</main>}><Builder /></Suspense>;
}
