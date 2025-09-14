// sanity/lib/live.ts
'use client'

import React, { ReactNode } from 'react'
import * as NextSanity from 'next-sanity'
import { client } from './client'

type SanityFetchFn = (query: string, params?: Record<string, any>) => Promise<any>
type SanityLiveComponent = (props: { children?: ReactNode }) => React.ReactElement | null

const NextSanityAny = NextSanity as any

let sanityFetch: SanityFetchFn
let SanityLive: SanityLiveComponent

if (typeof NextSanityAny.defineLive === 'function') {
  const res = NextSanityAny.defineLive({ client }) as any
  sanityFetch = res.sanityFetch
  SanityLive = res.SanityLive
} else {
  sanityFetch = async (query: string, params?: Record<string, any>) => {
    return client.fetch(query, params)
  }

  SanityLive = function ({ children }: { children?: ReactNode }) {
    // Use React.createElement instead of JSX so the file can remain .ts
    return React.createElement(React.Fragment, null, children ?? null)
  }
}

export { sanityFetch, SanityLive }
