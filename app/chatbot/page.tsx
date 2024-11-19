"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}
export default function ChatbotPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [finalPrompt, setFinalPrompt] = useState<string | null>(null);
    // Add new state for tracking conversation completion
    const [isConversationComplete, setIsConversationComplete] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const initialMessage: Message = {
            role: "assistant",
            content: "Hello! I'm here to help you design your website. What's the main purpose of your website?",
        };
        setMessages([initialMessage]);
    }, []);
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Add isConversationComplete check to prevent submission
        if (!input.trim() || isLoading || isConversationComplete) return;
        const newMessage: Message = { role: "user", content: input };
        setMessages(prev => [...prev, newMessage]);
        setInput("");
        setIsLoading(true);
        try {
            const response = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: messages.filter(m => m.role !== 'system').concat(newMessage)
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.response) {
                setMessages(prev => [
                    ...prev,
                    { role: "assistant", content: data.response },
                ]);
                // Check if the response contains a final prompt
                if (data.response.includes('FINAL_PROMPT_START')) {
                    const promptMatch = data.response.match(/FINAL_PROMPT_START\s*([\s\S]*?)\s*FINAL_PROMPT_END/);
                    if (promptMatch) {
                        const extractedPrompt = promptMatch[1].trim();
                        setFinalPrompt(extractedPrompt);
                        // Set conversation as complete when final prompt is generated
                        setIsConversationComplete(true);
                        console.log("Final prompt generated:", extractedPrompt);
                    }
                }
            }
        } catch (error) {
            console.error("Error:", error);
            setMessages(prev => [
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
    // Add function to handle Pur-duce button click
    const handlePurduce = () => {
        if (finalPrompt) {
            // You can replace this with your actual logic
            alert(`Pur-duce initiated with final prompt: ${finalPrompt}`);
        }
    };
    return (
        <div className="flex flex-col h-screen bg-[#1E1E1E]">
            <header className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image
                            src="/assets/images/logo.png"
                            alt="Website Design AI"
                            width={40}
                            height={40}
                            className="object-cover"
                        />
                    </div>
                    <h1 className="text-white text-xl font-semibold">Catmod</h1>
                    <h1 className="text-orange-700 text-xl font-semibold">AI</h1>
                </div>
                <button
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                        finalPrompt ? "bg-[#FF5722] text-white hover:bg-[#FF7043]" : "bg-gray-500 text-gray-300 cursor-not-allowed"
                    }`}
                    disabled={!finalPrompt}
                    onClick={handlePurduce}  // Add onClick handler
                >
                    <span>✨</span>
                    <span>Pur-duce</span>
                </button>
            </header>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
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
                                        src="/assets/images/logo.png"
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
                                        src="/assets/images/images.png"
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
                            placeholder={
                                isConversationComplete
                                    ? "Conversation complete - Click Pur-duce to continue"
                                    : "Respond to the website design question"
                            }
                            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5722] placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isConversationComplete}  // Disable input when conversation is complete
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading || isConversationComplete}  // Disable button when conversation is complete
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

