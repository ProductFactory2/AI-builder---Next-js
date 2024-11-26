"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  return (
    <div className="flex-1 overflow-auto text-white flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-red-500">Profile Page</h1>
      <h1 className="text-2xl font-bold text-orange-700">Hey, {email}</h1>
      <p className="text-gray-400 text-sm">coming soon</p>
    </div>
  );
}
