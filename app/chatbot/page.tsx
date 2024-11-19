"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import genData from "@/utils/Generatedata";
interface Message {
  role: "user" | "assistant";
  content: string;
}
export default function Component() {
  const globalData = useSelector((data:any) => data);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    // Send initial requirement gathering message
    const initialMessage: Message = {
      role: "assistant",
      content: "What's on your mind, how could we helpful?"
    };
    setMessages([initialMessage]);
  }, []);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const newMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.response) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const generateAIModel=()=>{
    console.log(globalData.projects.prompt)
    let API= process.env.NEXT_PUBLIC_GEM_API;
    console.log(API)
    genData(globalData.projects.prompt,API )

  }
  return (
    <div className="flex flex-col h-screen bg-[#1E1E1E]">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src="/logocat.png"
              alt="Website Design AI"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <h1 className="text-white text-xl font-semibold">Catmod</h1>
          <h1 className=" text-orange-700 text-xl font-semibold">AI</h1>
        </div>
        <button onClick={generateAIModel} className="px-4 py-2 bg-[#FF5722] text-white rounded-lg flex items-center space-x-2">
          <span>✨</span>
          <span>Pur-duce</span>
        </button>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex items-start max-w-[80%] space-x-2">
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="/logocat.png"
                    alt="AI"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
              )}
              <div
                className={`p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-[#FF5722] text-white"
                    : "bg-gray-600 text-white"
                }`}
              >
                {message.content}
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="/images.png"
                    alt="User"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-gray-600 text-white p-3 rounded-lg">
              <div
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              />
              <div
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Respond to the website design question"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5722] placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 bg-[#FF5722] text-white rounded-lg disabled:opacity-50 hover:bg-[#FF7043] transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}