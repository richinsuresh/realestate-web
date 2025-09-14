// src/app/studio/StudioClient.tsx
'use client'

import React from 'react'
import { NextStudio } from 'next-sanity/studio'
import config from '../../sanity.config' // resolves to src/sanity.config.ts

export default function StudioClientWrapper() {
  return <NextStudio config={config} />
}
