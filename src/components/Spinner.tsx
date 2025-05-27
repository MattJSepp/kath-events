// src/components/Spinner.tsx
import React from 'react'

export default function Spinner() {
  return (
    <div className="flex justify-center py-8">
      <div className="w-8 h-8 border-4 border-t-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
