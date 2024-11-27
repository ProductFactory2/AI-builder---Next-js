import { cn } from "@/lib/utils";

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
}

export function PasswordStrength({ password, checks, score, strength }: PasswordStrengthProps) {
  if (!password) return null;

  const strengthLabels = {
    weak: "Weak",
    medium: "Medium",
    strong: "Strong"
  };

  return (
    <div className="flex flex-col p-4 border border-gray-300 rounded-lg shadow-md">
      <div className="flex items-center">
        {/* Strength Bar */}
        <div className="flex-grow h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-300",
              {
                'bg-red-500': score > 0 && score <= 1,
                'bg-orange-500': score > 1 && score <= 2,
                'bg-yellow-500': score > 2 && score <= 3,
                'bg-lime-500': score > 3 && score <= 4,
                'bg-green-500': score > 4,
              }
            )}
            style={{ width: `${(score / 5) * 100}%` }} // Dynamic width based on score
          />
        </div>
        {/* Strength Label */}
        <span className={`ml-2 font-medium ${strength === 'weak' ? 'text-red-500' : strength === 'medium' ? 'text-yellow-500' : 'text-green-500'}`}>
          Strength: {strengthLabels[strength]}
        </span>
      </div>
      {/* Checks */}
      <div className="flex flex-wrap gap-2 mt-2 text-xs"> {/* Changed to text-xs for smaller size */}
        <div className={cn("flex items-center", checks.length ? "text-green-600" : "text-gray-400")}>
          <span className="ml-1">8+ Characters</span> {/* Added margin for spacing */}
        </div>
        <div className={cn("flex items-center", checks.uppercase ? "text-green-600" : "text-gray-400")}>
          <span className="ml-1">Uppercase</span>
        </div>
        <div className={cn("flex items-center", checks.lowercase ? "text-green-600" : "text-gray-400")}>
          <span className="ml-1">Lowercase</span>
        </div>
        <div className={cn("flex items-center", checks.number ? "text-green-600" : "text-gray-400")}>
          <span className="ml-1">Number</span>
        </div>
        <div className={cn("flex items-center", checks.special ? "text-green-600" : "text-gray-400")}>
          <span className="ml-1">Special Character</span>
        </div>
      </div>
    </div>
  );
}