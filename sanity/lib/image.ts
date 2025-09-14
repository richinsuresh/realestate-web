// ./sanity/lib/image.ts — replace the env import with explicit env reads
import imageUrlBuilder from '@sanity/image-url'
import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

// Read from env (works both locally and on Vercel)
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || '28d9tox0'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'development'

// create builder
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: SanityImageSource) => builder.image(source)
export default urlFor
