// sanity/lib/live.ts
'use client'

import React, { ReactNode, FC } from 'react'

/**
 * Lightweight runtime-safe sanity helpers.
 * Dynamic import of './client' avoids pulling client into config-time code.
 * Use React.createElement instead of JSX so this can remain a .ts file.
 */

export const sanityFetch = async <T = any>(query: string, params?: any): Promise<T> => {
  const { client } = await import('./client')
  return client.fetch<T>(query, params as any)
}

export const SanityLive: FC<{ children?: ReactNode }> = ({ children }) => {
  // use createElement to avoid JSX in .ts file
  return React.createElement(React.Fragment, null, children ?? null)
}
