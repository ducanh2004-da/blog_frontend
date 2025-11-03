// src/lib/index.ts

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export GSAP if you're using it
export { gsap } from 'gsap'
export { useGSAP } from '@gsap/react'

// Export other utilities as needed
export * from './utils'