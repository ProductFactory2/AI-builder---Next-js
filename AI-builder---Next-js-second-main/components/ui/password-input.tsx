'use client'

import * as React from "react"
import { Input } from "./input"
import { Button } from "./button"
import { EyeIcon, EyeOffIcon } from "lucide-react"

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={className}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant="outline"
          className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 border-none bg-transparent hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeIcon className="h-4 w-4 text-gray-500" />
          ) : (
            <EyeOffIcon className="h-4 w-4 text-gray-500" />
          )}
        </Button>
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"