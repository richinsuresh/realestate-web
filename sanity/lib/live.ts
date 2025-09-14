// sanity/lib/live.ts
'use client'

import React from 'react'
import * as NextSanity from 'next-sanity'
import { client } from './client'

type SanityFetchFn = (query: string, params?: Record<string, any>) => Promise<any>
type SanityLiveComponent = React.ComponentType<{ children?: React.ReactNode }>

const NextSanityAny = NextSanity as any

let sanityFetch: SanityFetchFn
let SanityLive: SanityLiveComponent

if (typeof NextSanityAny.defineLive === 'function') {
  // Use library defineLive if available
  const res = NextSanityAny.defineLive({ client }) as any
  sanityFetch = res.sanityFetch
  SanityLive = res.SanityLive
} else {
  // Fallback: use client.fetch and a passthrough component
  sanityFetch = async (query: string, params?: Record<string, any>) => {
    return client.fetch(query, params)
  }

  SanityLive = ({ children }: { children?: React.ReactNode }) => {
    return <>{children ?? null}</>
  }
}

export { sanityFetch, SanityLive }
