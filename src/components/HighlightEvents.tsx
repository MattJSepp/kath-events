import React from 'react'
import { EventCardHighlight } from './EventCardHighlight'
import { HIGHLIGHT_IDS }    from '../config/highlights'
import type { Event }       from '../app/api/events/types'

export const revalidate = 0

export default async function HighlightEvents() {
  const base   = process.env.BASE_URL!
  const idsStr = HIGHLIGHT_IDS.join(',')
  const res    = await fetch(
    `${base}/api/events?ids=${idsStr}`,
    { cache: 'no-store' }
  )
  const data   = (await res.json()) as { events: Event[] }
  const events = data.events

  return (
    <section id="highlights" className="container mx-auto px-4 my-12">
      <h2 className="text-3xl font-semibold mb-6">Highlights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {events.map(evt => (
        <EventCardHighlight key={evt.id} event={evt} />
        ))}
      </div>
      
    </section>
  )
}
