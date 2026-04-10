import { ReactNode } from "react";

interface PhotoSectionProps {
  imageUrl: string;
  children: ReactNode;
  className?: string;
  overlayOpacity?: string;
}

export function PhotoSection({
  imageUrl,
  children,
  className = "",
  overlayOpacity = "bg-black/45",
}: PhotoSectionProps) {
  return (
    <section
      className={`parallax-section relative min-h-[500px] ${className}`}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className={`absolute inset-0 ${overlayOpacity}`} />
      <div className="relative z-10">{children}</div>
    </section>
  );
}
