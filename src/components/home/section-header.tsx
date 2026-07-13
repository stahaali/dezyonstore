import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}

export function SectionHeader({
  label,
  title,
  description,
  href,
  linkLabel = "View All",
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        {label && (
          <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-accent">
            {label}
          </span>
        )}
        <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">{title}</h2>
        {description && (
          <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
        )}
      </div>
      {href && (
        <Button variant="outline" asChild className="shrink-0">
          <Link href={href}>
            {linkLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}
