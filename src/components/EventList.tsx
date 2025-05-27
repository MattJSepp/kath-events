// src/components/EventList.tsx
import React from 'react'
import { EventCardSearch } from './EventCardSearch'
import type { Event } from '../app/api/events/types'

interface EventListProps {
  q?: string
  loc?: string
  cat?: string
  start?: string
  end?: string
}

export const revalidate = 0  // immer frisch laden

export default async function EventList({ q, loc, cat, start, end }: EventListProps) {
  const base = process.env.BASE_URL!
  const params = new URLSearchParams()
  if (q)     params.set('q', q)
  if (loc)   params.set('loc', loc)
  if (cat)   params.set('cat', cat)
  if (start) params.set('start', start)
  if (end)   params.set('end', end)

  const res = await fetch(`${base}/api/events?${params.toString()}`, {
    cache: 'no-store'
  })
  const data   = (await res.json()) as { events: Event[] }
  const events = data.events

  return (
    <section id="search-results" className="container mx-auto px-4 my-12">
        <h2 className="text-3xl font-semibold mb-6">Suchergebnisse</h2>
      {events.length === 0 ? (
        <p className="text-center text-gray-600">Keine Ergebnisse gefunden</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0,8).map(evt => (
            <EventCardSearch key={evt.id} event={evt} />
          ))}
        </div>
      )}
    </section>
  )
}
