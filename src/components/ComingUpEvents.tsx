import React from 'react'
import { EventCardGrid } from './EventCardGrid'
import type { Event } from '../app/api/events/types'

export const revalidate = 0

export default async function ComingUpEvents() {
  // Datum von heute in ISO (UTC)
  const today = new Date().toISOString()

  // Absoluter Fetch-Pfad
  const base = process.env.BASE_URL!
  const res  = await fetch(
    `${base}/api/events?start=${encodeURIComponent(today)}`,
    { cache: 'no-store' }
  )
  const data   = (await res.json()) as { events: Event[] }
  const events = data.events

  return (
    <section id="upcoming" className="container mx-auto px-4 my-12">
      <h2 className="text-3xl font-semibold mb-6">Coming Up Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.slice(0, 20).map((evt: Event) => (
          <EventCardGrid key={evt.id} event={evt} />
        ))}
      </div>
    </section>
  )
}
