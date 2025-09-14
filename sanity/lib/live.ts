// sanity/lib/live.ts
import React from 'react'
// Import namespace to avoid TS error if named exports differ by version
import * as NextSanity from 'next-sanity'
import { client } from './client'

// Defensive defineLive: use library-provided defineLive if present, otherwise provide a fallback.
type DefineLiveReturn = {
  sanityFetch: (query: string, params?: Record<string, any>) => Promise<any>
  SanityLive: React.ComponentType<{ children?: React.ReactNode }>
}

const libDefineLive = (NextSanity as any).defineLive

const defineLive = libDefineLive ?? function (_opts: any): DefineLiveReturn {
  // Fallback implementation:
  // - sanityFetch delegates to your client.fetch (no live/real-time updates)
  // - SanityLive is a simple passthrough wrapper (no websockets / real-time)
  return {
    sanityFetch: async (query: string, params?: Record<string, any>) => {
      return client.fetch(query, params)
    },
    SanityLive: ({ children }: { children?: React.ReactNode }) => {
      return <>{children ?? null}</>
    },
  }
}

// Export the expected API shape for the rest of your app
export const { sanityFetch, SanityLive } = defineLive({ client })
