'use client'
import React, { useState, useEffect } from 'react'
import { EventCardSearch } from './EventCardSearch'
import Spinner from './Spinner'
import type { Event } from '@/app/api/events/types'

interface EventListProps {
  searchParams: Record<string, string | undefined>
}

export default function EventList({ searchParams }: EventListProps) {
  const [events, setEvents]     = useState<Event[]>()
  const [visible, setVisible]   = useState(6)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    setLoading(true)
    // undefined-Werte entfernen
    const filtered: Record<string, string> = {}
    Object.entries(searchParams).forEach(([key, val]) => {
      if (val !== undefined && val !== '') {
        filtered[key] = val
      }
    })
    // nur mit gültigen Strings an URLSearchParams
    const paramString = new URLSearchParams(filtered).toString()

    fetch(`/api/events?${paramString}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        setEvents(data.events)
        setVisible(6)
      })
      .finally(() => setLoading(false))
  }, [searchParams])

  if (loading || !events) return <Spinner />

  const hasMore = events.length > visible

  return (
    <section id="search-results" className="container mx-auto px-4 my-12">
      <h2 className="text-3xl font-semibold mb-6">Ergebnisse</h2>
      {events.length === 0 ? (
        <p className="text-center text-gray-600">Keine Ergebnisse gefunden</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, visible).map(evt => (
              <EventCardSearch key={evt.id} event={evt} />
            ))}
          </div>
          {hasMore && (
            <div className="text-center mt-6">
              <button
                onClick={() => setVisible(v => v + 6)}
                className="inline-flex items-center text-blue-600 hover:underline"
              >
                Mehr laden ↓
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
