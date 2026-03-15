import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { createClient } from "@supabase/supabase-js"
import { retrieveVerses } from "../src/lib/retrieve"

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
)

async function run() {

    const query = "afsgd?"

    const verses = await retrieveVerses(query, supabase)

    console.log("Query:", query)

    if (!verses || verses.length === 0) {
        console.log("No verses found")
        return
    }

    for (const v of verses) {

        console.log(`BG ${v.chapter}.${v.verse}`)
        console.log(v.text_translation)
        console.log("------")

    }

}

run()