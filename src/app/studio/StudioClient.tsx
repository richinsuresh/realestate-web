'use client'

import React from 'react'
import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config' // correct relative path

export default function StudioClientWrapper() {
  return <NextStudio config={config} />
}
