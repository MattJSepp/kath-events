'use client'
import React, { useState, useEffect } from 'react'
import { EventCardHighlight } from './EventCardHighlight'
import type { Event } from '@/app/api/events/types'
import Spinner from './Spinner'
import { HIGHLIGHT_IDS }    from '../config/highlights'

export default function HighlightEvents() {
  const [events, setEvents] = useState<Event[]>()

  useEffect(() => {
    fetch(`/api/events?ids=${HIGHLIGHT_IDS.join(',')}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(data => setEvents(data.events))
  }, [])

  // Solange noch nicht geladen: Spinner
  if (!events) return <Spinner />

  // Falls keine Highlights vorhanden, gar nichts rendern
  if (events.length === 0) return null

  return (
    <section id="highlights" className="container mx-auto px-4 my-12 space-y-8">
      <h2 className="text-3xl font-semibold mb-6">Highlights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map(evt => (
          <EventCardHighlight key={evt.id} event={evt} />
        ))}
      </div>
    </section>
  )
}