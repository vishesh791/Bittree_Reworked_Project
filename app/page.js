"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const features = [
  { number: "01", title: "Your corner of the internet", text: "Bring your work, social profiles, portfolio, and favorite places together on one memorable page." },
  { number: "02", title: "Made to feel like you", text: "Choose a handle, add a short introduction, and give your page a personality of its own." },
  { number: "03", title: "One link. More possibilities.", text: "Share one simple address wherever people discover you—your bio, portfolio, or email signature." },
];

export default function Home() {
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [error, setError] = useState("");

  function startBuilding(event) {
    event.preventDefault();
    const normalized = handle.trim().toLowerCase().replace(/^@/, "");
    if (!/^[a-z0-9_-]{3,24}$/.test(normalized)) {
      setError("Use 3–24 characters: lowercase letters, numbers, hyphens, or underscores.");
      return;
    }
    setError("");
    router.push(`/generate?handle=${encodeURIComponent(normalized)}`);
  }

  return (
    <main className="site-main">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> YOUR DIGITAL HOMEBASE</div>
          <h1>Everything you share.<br /><span>One place to find it.</span></h1>
          <p className="hero-lede">A little page with a lot of you. Gather your work, social links, and favorite corners of the web into one polished profile.</p>
          <form id="start" className="handle-form" onSubmit={startBuilding}>
            <label className="handle-input-wrap">
              <span className="handle-prefix">bittree.me/</span>
              <input aria-label="Choose your handle" value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="yourname" maxLength={24} />
            </label>
            <button className="button button-dark" type="submit">Build my page <span aria-hidden="true">↗</span></button>
          </form>
          {error && <p className="form-error" role="alert">{error}</p>}
          <p className="microcopy">Free to start · No design skills needed</p>
          <div className="hero-proof"><div className="avatar-stack"><span>J</span><span>M</span><span>A</span><span>+</span></div><span>For makers, students, creators, and curious people.</span></div>
        </div>
        <div className="hero-visual" aria-label="Example profile preview">
          <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
          <div className="preview-card">
            <div className="preview-top"><span className="preview-brand"><i /> bittree</span><span className="preview-dots">•••</span></div>
            <div className="profile-art"><div className="art-sun" /><div className="art-hill hill-back" /><div className="art-hill hill-front" /><span className="art-star star-a">✳</span><span className="art-star star-b">✦</span></div>
            <div className="preview-profile"><div className="profile-avatar">✳</div><div><strong>Alex Morgan</strong><span>Designer · maker · daydreamer</span></div><span className="verified">✓</span></div>
            <p className="preview-bio">Collecting little ideas and turning them into things worth sharing.</p>
            <div className="preview-link link-lilac"><span className="link-symbol">✳</span> Selected work <span>↗</span></div>
            <div className="preview-link link-peach"><span className="link-symbol">◎</span> Instagram <span>↗</span></div>
            <div className="preview-link link-mint"><span className="link-symbol">▶</span> Watch my latest <span>↗</span></div>
            <div className="preview-link link-cream"><span className="link-symbol">✉</span> Say hello <span>↗</span></div>
            <div className="preview-foot">A small page. A whole lot of personality.</div>
          </div>
          <div className="floating-note note-top"><span>✦</span> Made for you</div>
          <div className="floating-note note-bottom"><span>↗</span> One link to share</div>
        </div>
      </section>

      <section className="ticker" aria-label="What you can share"><div>YOUR WORK <span>✳</span> YOUR WORLD <span>✳</span> YOUR PEOPLE <span>✳</span> YOUR NEXT CHAPTER <span>✳</span> YOUR WORK <span>✳</span></div></section>

      <section id="features" className="features-section">
        <div className="section-heading"><p className="eyebrow">LESS SCROLLING, MORE YOU</p><h2>Your online life,<br />with room to breathe.</h2><p>Keep the important things together without making your audience hunt for them.</p></div>
        <div className="feature-grid">{features.map((feature) => <article className="feature-card" key={feature.number}><span className="feature-number">{feature.number}</span><div className="feature-mark">{feature.number === "01" ? "↗" : feature.number === "02" ? "✳" : "∞"}</div><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div>
      </section>

      <section className="closing-cta"><div><p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p><h2>Make a little space<br />for everything you are.</h2></div><button className="button button-light" onClick={() => document.querySelector(".handle-form input")?.focus()}>Choose your handle <span>↑</span></button><span className="cta-spark">✳</span></section>
      <footer className="site-footer"><span className="footer-logo"><i /> bittree</span><span>A home for all your links.</span><span>Built for people, not algorithms.</span></footer>
    </main>
  );
}
