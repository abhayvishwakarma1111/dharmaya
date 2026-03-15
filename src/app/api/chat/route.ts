import { NextResponse } from "next/server"
import OpenAI from "openai"

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
})

export async function POST(req: Request) {
    try {

        const { message } = await req.json()

        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `
You are Dharmaya, an assistant that helps people with questions about Hindu dharma, rituals, fasting, festivals, and traditions.

Language Rules:
- Always respond in the same language style used by the user.
- If the user writes in English, reply in English.
- If the user writes in Hindi (Devanagari script), reply in Hindi.
- If the user writes in Hinglish (Hindi written in English letters), reply in Hinglish.
- Do not switch languages unless the user does.

Behavior Rules:
- Explain things clearly and respectfully.
- Keep answers simple and easy to understand.
- If explaining religious practices, mention that traditions may vary.

Never invent scripture references.
`
                },
                {
                    role: "user",
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 1024
        })

        const reply =
            completion.choices?.[0]?.message?.content ?? "No response generated."

        return NextResponse.json({ reply })

    } catch (error) {

        console.error("Groq API error:", error)

        return NextResponse.json(
            { reply: "Server error while generating response." },
            { status: 500 }
        )
    }
}