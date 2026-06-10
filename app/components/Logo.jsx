import Image from "next/image";
import Link from "next/link";

export default function Logo({ className = "" }) {
  return (
    <Link href="/" className={`brand-logo ${className}`} aria-label="UMV Digital Solutions home">
      <Image
        src="/umv1.png"
        alt="UMV Digital Solutions"
        width={220}
        height={104}
        priority
        sizes="(max-width: 780px) 112px, 150px"
      />
    </Link>
  );
}
