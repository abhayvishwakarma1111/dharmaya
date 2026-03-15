import { pipeline } from "@xenova/transformers"

let extractor: any = null

export async function generateEmbedding(text: string) {

    if (!extractor) {
        extractor = await pipeline(
            "feature-extraction",
            "Xenova/bge-small-en-v1.5"
        )
    }

    const result = await extractor(text, { pooling: "mean", normalize: true })

    return Array.from(result.data)
}