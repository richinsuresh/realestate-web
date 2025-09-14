// src/app/studio/StudioClient.tsx  (location: src/app/studio/StudioClient.tsx)
'use client'

import React from 'react'
import { NextStudio } from 'next-sanity/studio'

// IMPORTANT: this import points to the root config file above.
// From src/app/studio -> go up 3 levels to repo root: '../../../sanity.config'
import config from '../../../sanity/sanity.config'

export default function StudioClientWrapper() {
  return <NextStudio config={config} />
}
