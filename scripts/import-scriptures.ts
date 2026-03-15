import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import fs from "fs"
import path from "path"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
)

async function run() {

    const folderPath = path.join(process.cwd(), "data/gita")

    const files = fs.readdirSync(folderPath)

    for (const file of files) {

        if (!file.endsWith(".json")) continue

        const filePath = path.join(folderPath, file)

        const raw = fs.readFileSync(filePath, "utf-8")
        const verse = JSON.parse(raw)

        const record = {
            scripture: "Bhagavad Gita",
            chapter: verse.chapter,
            verse: verse.verse,
            topic: "bhagavad gita",
            text_original: verse.slok,
            text_translation: verse.prabhu?.et || null,
            explanation: verse.chinmay?.hc || null
        }

        const { error } = await supabase
            .from("knowledge")
            .insert(record)

        if (error) {
            console.error("Insert error:", file, error)
        } else {
            console.log(`Inserted ${verse.chapter}.${verse.verse}`)
        }

    }

}

run()