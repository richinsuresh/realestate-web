// sanity/lib/live.ts
import React from 'react'
import * as NextSanity from 'next-sanity'
import { client } from './client'

// Minimal expected shape returned by defineLive
type DefineLiveReturn = {
  sanityFetch: (query: string, params?: Record<string, any>) => Promise<any>
  SanityLive: React.ComponentType<{ children?: React.ReactNode }>
}

// Try to use library's defineLive if it's available and is a function.
// Otherwise provide a safe fallback implementation.
const maybeDefineLive = (NextSanity as any).defineLive

const defineLive: (opts?: any) => DefineLiveReturn =
  typeof maybeDefineLive === 'function'
    ? (maybeDefineLive as (opts?: any) => DefineLiveReturn)
    : (_opts?: any) =>
        ({
          // delegate to the existing Sanity client fetch (no live updates)
          sanityFetch: async (query: string, params?: Record<string, any>) => {
            return client.fetch(query, params)
          },
          // passthrough component; renders children directly
          SanityLive: ({ children }: { children?: React.ReactNode }) => {
            return <>{children ?? null}</>
          },
        } as DefineLiveReturn)

export const { sanityFetch, SanityLive } = defineLive({ client })
