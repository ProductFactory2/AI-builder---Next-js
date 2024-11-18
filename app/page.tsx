import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 p-8">
      <div className="relative w-full max-w-[1200px] overflow-hidden rounded-[40px] bg-white shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left side - Image */}
          <div className="flex items-center justify-center bg-gray-100 p-12">
            <div className="relative h-96 w-96">
              <Image
                src="/images/cat.png"
                alt="Cat with headphones"
                width={600}
                height={600}
                className="object-contain"
              />
            </div>
          </div>

          {/* Right side - Links */}
          <div className="flex flex-col justify-center space-y-8 bg-zinc-900 p-12 text-white">
            <div className="space-y-3 text-center">
              <h1 className="text-4xl font-bold">Welcome to Catmode</h1>
            </div>

            <div className="flex flex-col gap-6">
              <Link
                href="/login"
                className="w-full h-12 rounded-md bg-orange-500 py-3 text-center text-base font-medium text-white hover:bg-orange-600"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="w-full h-12 rounded-md border border-gray-700 py-3 text-center text-base font-medium text-white hover:bg-gray-800"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}