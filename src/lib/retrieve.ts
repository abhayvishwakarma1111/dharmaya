import { generateEmbedding } from "./embeddings"

export async function retrieveVerses(query: string, supabase: any) {

    const embedding = await generateEmbedding(query)

    const { data, error } = await supabase.rpc("match_verses", {
        query_embedding: embedding,
        match_count: 5
    })

    if (error) {
        console.error(error)
        return []
    }

    return data
}