"use client";

import { useState, FormEvent } from "react";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  // 👇 Replace this with your n8n webhook URL
  const webhookUrl = "https://09979dcbe803.ngrok-free.app/webhook/chat";

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMsg: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setStatus("Sending...");

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        setStatus("❌ Failed to send message.");
        return;
      }

      const data: { output?: string } = await response.json();

      const botReply: Message = {
        role: "bot",
        text: data.output || "🤖 (no reply from n8n)",
      };

      setMessages((prev) => [...prev, botReply]);
      setStatus("");
    } catch (error) {
      console.error(error);
      setStatus("❌ Error connecting to n8n.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-2xl w-full max-w-md p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          💬 Chat with n8n
        </h1>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-4 border rounded-lg p-4 bg-gray-50 h-96">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">Start chatting...</p>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex mb-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[75%] ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={sendMessage} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Send
          </button>
        </form>

        {status && (
          <p className="text-center text-sm text-gray-500 mt-2">{status}</p>
        )}
      </div>
    </main>
  );
}

