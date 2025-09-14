// sanity/lib/live.ts
import React from 'react'
import * as NextSanity from 'next-sanity'
import { client } from './client'

// Use runtime checks and simple assignments so TypeScript won't infer an incompatible union type.
// This works whether next-sanity exports defineLive or not.

type SanityFetchFn = (query: string, params?: Record<string, any>) => Promise<any>
type SanityLiveComponent = React.ComponentType<{ children?: React.ReactNode }>

const NextSanityAny = NextSanity as any

let sanityFetch: SanityFetchFn
let SanityLive: SanityLiveComponent

if (typeof NextSanityAny.defineLive === 'function') {
  // use the library's defineLive if it exists (expected shape)
  const res = NextSanityAny.defineLive({ client }) as any
  sanityFetch = res.sanityFetch
  SanityLive = res.SanityLive
} else {
  // fallback: delegate to the client.fetch and provide a passthrough component
  sanityFetch = async (query: string, params?: Record<string, any>) => {
    return client.fetch(query, params)
  }

  SanityLive = ({ children }: { children?: React.ReactNode }) => {
    return <>{children ?? null}</>
  }
}

export { sanityFetch, SanityLive }
