import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"
import { retrieveVerses } from "@/lib/retrieve"

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
})

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
    try {

        const { message } = await req.json()

        // Retrieve relevant verses from Supabase
        const verses = await retrieveVerses(message, supabase)

        const context = verses
            ?.map(
                (v: any) =>
                    `Bhagavad Gita ${v.chapter}.${v.verse}: ${v.text_translation}`
            )
            .join("\n")

        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `
You are Dharmaya, an assistant that helps people with questions about Hindu dharma.

Language Rules:
- Reply in the same language style used by the user (English, Hindi, or Hinglish).

Answer using the scripture context below whenever relevant.

Scripture Context:
${context}

Rules:
- Do not invent scripture references.
- If the context does not contain the answer, say you are unsure.
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