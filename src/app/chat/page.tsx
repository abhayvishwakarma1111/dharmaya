"use client"

import { useState, useRef, useEffect } from "react"

type Message = {
    role: "user" | "assistant"
    content: string
}

export default function ChatPage() {

    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")

    const messagesEndRef = useRef<HTMLDivElement>(null)

    async function sendMessage() {

        if (!input.trim()) return

        const messageText = input

        const userMessage: Message = {
            role: "user",
            content: messageText
        }

        setMessages((prev) => [...prev, userMessage])
        setInput("")

        const res = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: messageText })
        })

        let data

        try {
            data = await res.json()
        } catch (error) {
            data = { reply: "Server returned an invalid response." }
        }

        const botMessage: Message = {
            role: "assistant",
            content: data.reply
        }

        setMessages((prev) => [...prev, botMessage])
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            sendMessage()
        }
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return (
        <div className="flex flex-col h-screen">

            {/* Header */}
            <div className="p-4 border-b text-center font-bold text-xl">
                Dharmaya
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`p-3 rounded-lg max-w-[80%] ${msg.role === "user"
                                ? "bg-black text-white ml-auto"
                                : "bg-black"
                            }`}
                    >
                        {msg.content}
                    </div>
                ))}

                <div ref={messagesEndRef} />

            </div>

            {/* Input Area */}
            <div className="border-t p-4 flex gap-2 mx-11">

                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="एकादशी में क्या खा सकते हैं?"
                    className="border p-3 rounded w-full"
                />

                <button
                    onClick={sendMessage}
                    className="bg-black text-white px-6 rounded"
                >
                    Send
                </button>

            </div>

        </div>
    )
}