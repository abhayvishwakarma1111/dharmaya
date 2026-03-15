import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { createClient } from "@supabase/supabase-js"
import { generateEmbedding } from "../src/lib/embeddings"

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
)

async function run() {

    const { data } = await supabase
        .from("knowledge")
        .select("*")
        .is("embedding", null)

    if (!data) {
        console.log("No rows found")
        return
    }

    for (const row of data) {

        const text = `${row.text_original} ${row.text_translation || ""}`

        const embedding = await generateEmbedding(text)

        await supabase
            .from("knowledge")
            .update({ embedding })
            .eq("id", row.id)

        console.log(`Embedded verse ${row.chapter}.${row.verse}`)

    }

}

run()