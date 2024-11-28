"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { store } from "@/store/store";
import { clearProjects } from "@/store/projectSlice";
import { useSession } from "next-auth/react";
import Foot from "@/public/foot-print.svg";
import Logo from "@/public/assets/images/logo.png";
import UserIcon from "@/public/images/images.png";
import { Paperclip, File } from "lucide-react";
import ImageIcon from "@/public/images/img.png";
import FilePdf from "@/public/images/pdf.png";
import generateHtml from "@/utils/html-genarate";
import LoaderPage from '@/components/loader/page';

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface FileData {
  fileName: string;
  fileData: string;
  fileType: string;
}

export default function ChatbotPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState<string | null>(null);
  const [isConversationComplete, setIsConversationComplete] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [isRefreshModalOpen, setIsRefreshModalOpen] = useState(false);
  const { data: session } = useSession();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isProducing, setIsProducing] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(()=>{
    if(store.getState().projects.localProjects.length === 0){
      router.push("/dashboard");
    }
  },[]);
  useEffect(() => {
    const initialMessage: Message = {
      role: "assistant",
      content: "Hello! I'm here to help you design your website.",
    };
    setMessages([initialMessage]);
  }, []);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading || isConversationComplete) return;
    const newMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/chatgpt-chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages
            .filter((m) => m.role !== "system")
            .concat(newMessage),
        }),
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
        if (data.response.includes("Content")) {
          const promptMatch = data.response.match(
            /Content\s*([\s\S]*?)\s*Content_End/
          );
          if (promptMatch) {
            const extractedPrompt = promptMatch[1].trim();
            setFinalPrompt(extractedPrompt);
            setIsConversationComplete(true);
            console.log("Final prompt generated:", extractedPrompt);
          }
        }
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
  const handlePurduce = async () => {
    setButtonDisabled(true);
    if (!finalPrompt || !session?.user?.id) {
      console.error("Missing required data");
      return;
    }

    try {
      setIsProducing(true);

      const name = store.getState().projects.localProjects[0].name;
      const technologies =
        store.getState().projects.localProjects[0].technologies;
      const userId = session.user.id;

      const projectData = {
        finalPrompt,
        userId,
        name,
        technologies,
        referenceFile: fileData // Include the file data if it exists
      };

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      store.dispatch(clearProjects());
      const data = await response.json();
      console.log("Project created:", data);
      await generateHtml(userId,name,finalPrompt)
      router.push("/preview/status/?userId=" + userId + "&projectName=" + name);
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsProducing(false);
    }
  };

  const handleOut = () => {
    console.log("handleback called");
    console.log("messages length:", messages.length);

    if (
      messages.length > 0 ||
      finalPrompt ||
      isConversationComplete ||
      input.trim()
    ) {
      console.log("Opening modal");
      setIsBackModalOpen(true);
      store.dispatch(clearProjects());
    } else {
      console.log("Redirecting to dashboard");
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    // Prevent navigation when in chatbot
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    // Handle manual URL changes
    const handlePopState = () => {
      window.history.pushState(null, "", "/chatbot");
      store.dispatch(clearProjects());
    };

    // Push initial state
    window.history.pushState(null, "", "/chatbot");

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      // Clean up event listeners
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleRefresh = (e: BeforeUnloadEvent) => {
    if (
      messages.length > 1 ||
      finalPrompt ||
      isConversationComplete ||
      input.trim()
    ) {
      e.preventDefault();
      e.returnValue = "";
      return "";
    }
  };

  const handleCustomRefresh = () => {
    if (
      messages.length > 1 ||
      finalPrompt ||
      isConversationComplete ||
      input.trim()
    ) {
      setIsRefreshModalOpen(true);
    } else {
      window.location.reload();
    }
  };

  const handleFileUpload = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.jpg,.jpeg,.png,.gif,.bmp,.tiff";
    fileInput.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        setSelectedFile(file);
        
        // Convert file to base64
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (event.target?.result) {
            const base64Data = event.target.result.toString().split(',')[1];
            setFileData({
              fileName: file.name,
              fileData: base64Data,
              fileType: file.type
            });
          }
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <Image src={FilePdf} alt="pdf" className="w-10 h-5 text-[#FF5722] hover:text-[#FF7043]" />;
      case 'jpg':
        return <Image src={ImageIcon} alt="jpg" className="w-5 h-5 text-[#FF5722] hover:text-[#FF7043]" />;
      case 'jpeg':
        return <Image src={ImageIcon} alt="jpg" className="w-5 h-5 text-[#FF5722] hover:text-[#FF7043]" />;
      case 'png':
        return <Image src={ImageIcon} alt="png" className="w-5 h-5 text-[#FF5722] hover:text-[#FF7043]" />;
      case 'gif':
        return <Image src={ImageIcon} alt="gif" className="w-5 h-5 text-[#FF5722] hover:text-[#FF7043]" />;
      case 'bmp':
        return <Image src={ImageIcon} alt="bmp" className="w-5 h-5 text-[#FF5722] hover:text-[#FF7043]" />;
      case 'tiff':
        return <Image src={ImageIcon} alt="tiff" className="w-5 h-5 text-[#FF5722] hover:text-[#FF7043]" />;
      default:
        return <Paperclip className="w-5 h-5 text-[#FF5722] hover:text-[#FF7043]" />;
    }
  };

  // if (isProducing) {
  //   return <LoaderPage />;
  // }

  return (
    <main className="flex flex-col h-screen bg-[#1E1E1E]">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            
            <Image
              src={Logo}
              alt="Website Design AI"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleOut();
            }}
          >
            <h1 className="text-white text-xl font-semibold">
              Catmod{" "}
              <span className="text-orange-700 text-xl font-semibold">AI</span>
            </h1>
          </Link>
        </div>
        <button
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            finalPrompt && !buttonDisabled
              ? "bg-[#FF5722] text-white hover:bg-[#FF7043]"
              : "bg-gray-500 text-gray-300 cursor-not-allowed"
          }`}
          disabled={!finalPrompt || buttonDisabled}
          onClick={handlePurduce}
        >
          <span>
            <Image
              src={Foot}
              alt="foot"
              className="object-cover"
              width={30}
              height={30}
            ></Image>
          </span>
          <span>Pur-duce</span>
        </button>
      </header>
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
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
                    src={Logo}
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
                    src={UserIcon}
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
        {selectedFile && (
          <div className="mb-2 p-2 bg-gray-700 rounded-lg flex items-center gap-2">
            <span>{getFileIcon(selectedFile.name)}</span>
            <span className="text-white text-sm truncate">{selectedFile.name}</span>
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                console.log("File cleared");
              }}
              className="ml-auto text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
        )}
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
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5722] placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isConversationComplete}
            />
            {/* <button 
              type="button"
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              onClick={handleFileUpload}
            >
              <Paperclip className="w-5 h-5 text-[#FF5722] hover:text-[#FF7043]" />
            </button> */}
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading || isConversationComplete}
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

      {isBackModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-[#1E1E1E] rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl text-white font-semibold mb-4">
              Leave Page?
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to leave? Your conversation progress will be
              lost.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  console.log("Cancel clicked");
                  setIsBackModalOpen(false);
                }}
                className="px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("Leave clicked");
                  setIsBackModalOpen(false);
                  router.push("/dashboard");
                }}
                className="px-4 py-2 rounded-md bg-[#FF5722] text-white hover:bg-[#FF7043]"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {isRefreshModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-[#1E1E1E] rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl text-white font-semibold mb-4">
              Refresh Page?
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to refresh? Your conversation progress will
              be lost.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  console.log("Cancel refresh clicked");
                  setIsRefreshModalOpen(false);
                }}
                className="px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCustomRefresh}
                className="px-4 py-2 rounded-md bg-[#FF5722] text-white hover:bg-[#FF7043]"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      )}
      {isProducing && <LoaderPage />}
    </main>
  );
}
