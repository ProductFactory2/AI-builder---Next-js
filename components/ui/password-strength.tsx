import * as React from "react"
import { cn } from "@/lib/utils"

interface PasswordStrengthProps {
  password: string;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
  score: number;
  strength: 'weak' | 'medium' | 'strong';
  onValidationChange?: (isValid: boolean) => void;
}

export function PasswordStrength({ password, checks, score, strength, onValidationChange }: PasswordStrengthProps) {
  React.useEffect(() => {
    const isValid = Object.values(checks).every(check => check === true);
    onValidationChange?.(isValid);
  }, [checks, onValidationChange]);

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 w-full rounded-full",
              {
                'bg-red-500': score > 0 && i === 0,
                'bg-orange-500': score > 1 && i === 1,
                'bg-yellow-500': score > 2 && i === 2,
                'bg-lime-500': score > 3 && i === 3,
                'bg-green-500': score > 4 && i === 4,
                'bg-gray-200': score <= i,
              }
            )}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        <div className={cn("text-gray-400", checks.length && "text-green-500")}>
          8+ Characters
        </div>
        <div className={cn("text-gray-400", checks.uppercase && "text-green-500")}>
          Uppercase
        </div>
        <div className={cn("text-gray-400", checks.lowercase && "text-green-500")}>
          Lowercase
        </div>
        <div className={cn("text-gray-400", checks.number && "text-green-500")}>
          Number
        </div>
        <div className={cn("text-gray-400", checks.special && "text-green-500")}>
          Special
        </div>
      </div>
    </div>
  )
}