import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

interface PathwayCardProps {
  title: string;
  href: string;
  delay?: number;
}

export function PathwayCard({ title, href, delay = 0 }: PathwayCardProps) {
  return (
    <Link href={href}>
      <div 
        className="group relative flex flex-col justify-between h-full bg-white p-8 md:p-10 border border-border/50 hover:border-accent/40 transition-all duration-500 hover:shadow-md cursor-pointer"
        style={{ animationDelay: `${delay}ms` }}
      >
        <h3 className="font-serif text-2xl text-primary leading-tight mb-12 pr-8">
          {title}
        </h3>
        
        <div className="flex items-center text-sm font-medium text-accent mt-auto group-hover:text-primary transition-colors">
          <span>Explore path</span>
          <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
        </div>
        
        <div className="absolute bottom-0 left-0 h-1 bg-accent w-0 group-hover:w-full transition-all duration-500 ease-out"></div>
      </div>
    </Link>
  );
}