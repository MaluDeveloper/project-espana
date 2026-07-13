import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarsProps {
  value: number; // 0..3
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-3.5 h-3.5",
  md: "w-5 h-5",
  lg: "w-7 h-7",
};

export const Stars = ({ value, size = "md", className }: StarsProps) => {
  return (
    <div className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${value} de 3 estrellas`}>
      {[0, 1, 2].map((i) => (
        <Star
          key={i}
          className={cn(
            sizeMap[size],
            i < value ? "fill-secondary text-secondary" : "fill-muted text-muted-foreground/40",
          )}
        />
      ))}
    </div>
  );
};
