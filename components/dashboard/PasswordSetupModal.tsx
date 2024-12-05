import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordStrength } from "@/components/ui/password-strength";
import { Button } from "@/components/ui/button";
import { validatePassword } from "@/lib/passwordValidation";

interface PasswordSetupModalProps {
  onPasswordSet: () => void;
}

export function PasswordSetupModal({ onPasswordSet }: PasswordSetupModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
    score: 0,
    strength: "weak"
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPass = e.target.value;
    setNewPassword(newPass);
    setPasswordValidation(validatePassword(newPass));
  };

  const handlePasswordSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!passwordValidation.isValid) {
      setPasswordError("Please meet all password requirements");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }

    try {
      const response = await fetch('/api/auth/setup-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      });

      if (!response.ok) {
        throw new Error('Failed to set password');
      }

      onPasswordSet();
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'Failed to set password');
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent 
        className="bg-zinc-900 text-white border-gray-700"
        hideClose
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Set Up Password</DialogTitle>
          <p className="text-sm text-gray-400">
            Please set up a secure password to access your projects
          </p>
        </DialogHeader>
        <form onSubmit={handlePasswordSetup} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <PasswordInput
                id="newPassword"
                value={newPassword}
                onChange={handlePasswordChange}
                className="bg-[#2A2A2A] border-none text-white mt-1.5"
                placeholder="Enter new password"
              />
            </div>
            
            <PasswordStrength
              password={newPassword}
              checks={passwordValidation.checks}
              score={passwordValidation.score}
              strength={passwordValidation.strength}
            />

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <PasswordInput
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-[#2A2A2A] border-none text-white mt-1.5"
                placeholder="Confirm password"
              />
            </div>
          </div>

          {passwordError && (
            <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-md">
              {passwordError}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-[#F05D23] hover:bg-[#F05D23]/80 h-11"
            disabled={!passwordValidation.isValid || !confirmPassword}
          >
            Set Password
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}