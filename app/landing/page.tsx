"use client";

import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="landing-container">
      <div className="image-container">
        <Image src="/your-image.jpg" alt="Website Image" layout="fill" objectFit="cover" className="image-shadow" />
      </div>
      <div className="buttons-container">
        <h1 className="site-title">My Amazing Website</h1>
        <div className="buttons">
          <Link href="/login">
            <a className="button">Connectez</a>
          </Link>
          <Link href="/register">
            <a className="button">S'inscrire</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
