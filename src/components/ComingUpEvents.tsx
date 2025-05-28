'use client'
import React, { useState, useEffect } from 'react'
import { EventCardGrid } from './EventCardGrid'
import type { Event }    from '@/app/api/events/types'
import Spinner            from './Spinner'

export default function ComingUpEvents() {
  const [events, setEvents]     = useState<Event[]>()
  const [visible, setVisible]   = useState(8)
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    fetch(`/api/events?start=${today}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setEvents(data.events))
  }, [today])

  if (!events) return <Spinner />
  const hasMore = events.length > visible

  return (
    <section id="upcoming" className="container mx-auto px-4 my-12">
      <h2 className="text-3xl font-semibold mb-6">Coming Up Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.slice(0, visible).map(evt => (
          <EventCardGrid key={evt.id} event={evt} />
        ))}
      </div>
      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={() => setVisible(v => v + 8)}
            className="inline-flex items-center text-blue-600 hover:underline"
          >
            Mehr laden ↓
          </button>
        </div>
      )}
    </section>
  )
}
