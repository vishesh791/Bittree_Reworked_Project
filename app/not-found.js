import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><div><p className="eyebrow">PAGE NOT FOUND</p><h1>This link took a little detour.</h1><p>The Bittree handle may not exist yet, or the address may be mistyped.</p><Link href="/">Back to Bittree home</Link></div></main>;
}
