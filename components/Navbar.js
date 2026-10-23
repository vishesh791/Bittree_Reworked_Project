"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const showNavbar = pathname === "/" || pathname === "/generate";
  if (!showNavbar) return null;

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Bittree home"><span className="brand-mark"><i /><i /><i /></span><span>bittree</span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        <Link href="/#features">Why Bittree</Link>
        <Link href="/#how-it-works">How it works</Link>
      </nav>
      <div className="header-actions"><Link className="header-signin" href="/generate">Create a page</Link><Link className="button button-dark header-button" href="/#start">Get started <span>↗</span></Link></div>
    </header>
  );
}
