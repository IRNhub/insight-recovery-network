import { ReactNode } from "react";

interface SectionHeaderProps {
  label?: string;
  heading: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
  children?: ReactNode;
}

export function SectionHeader({ 
  label, 
  heading, 
  description, 
  className = "", 
  align = "left",
  children 
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-col gap-4 max-w-3xl ${align === "center" ? "mx-auto text-center items-center" : ""} ${className}`}>
      {label && (
        <span className="text-xs font-semibold tracking-widest uppercase text-[#786036] font-sans">
          {label}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-primary leading-tight">
        {heading}
      </h2>
      {description && (
        <p className="text-lg text-muted-foreground leading-relaxed mt-2">
          {description}
        </p>
      )}
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
}