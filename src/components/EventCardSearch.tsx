// src/components/EventCardGrid.tsx
import React from 'react'
import Image from 'next/image'
import type { Event } from '../app/api/events/types'

interface Props { event: Event }

export function EventCardSearch({ event }: Props) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      <Image
        src={event.image_url || '/images/defaultEvent.png'}
        alt={event.title}
        width={400}
        height={250}
        className="object-cover h-48 w-full rounded"
        unoptimized={false}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <p className="text-sm text-gray-500">
          {new Date(event.event_date).toLocaleString('de-DE')}
        </p>
        <p className="mt-2 text-sm">{event.description}</p>
      </div>
    </div>
  )
}
