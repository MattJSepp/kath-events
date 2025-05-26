import React from 'react'
import Link from 'next/link'
import { Search, Calendar, MapPin } from 'lucide-react'
import { EventCardGrid } from '@/components/EventCardGrid'
import { EventCardHighlight } from '@/components/EventCardHighlight'
import { EventCardSearch } from '@/components/EventCardSearch'
import type { Event } from './api/events/types'

export const revalidate = 0  // immer frisch laden

export default async function HomePage() {
  // ① Sicherstellen, dass die Funktion async ist
  // ② Semikolons nicht vergessen, sonst vermatscht der Parser die Zeilen
  const base = process.env.BASE_URL!
  const res  = await fetch(`${base}/api/events`, { cache: 'no-store' });
  const data = (await res.json()) as { events: Event[] };   // ③ Hole das JSON und tippe es
  const events = data.events;

  return (
    
    <div className="min-h-screen flex flex-col"> {/* bg-gray-200*/}
      {/* Navbar */}
      <nav className="sticky top-0 bg-white shadow">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/images/logoTaube.png" alt="Logo" className="h-12 w-12" />
            <span className="text-2xl font-bold text-[#2B4593]">Katholische Events</span>
          </div>
          <div className="flex-1 px-4">
            <input
              type="text"
              placeholder="Suche nach Events..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-[#2B4593]"
            />
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-[#2B4593]">Home</Link>
            <Link href="/about" className="text-gray-700 hover:text-[#2B4593]">About Us</Link>
            <Link
              href="/events/new"
              className="inline-block px-4 py-2 bg-[#2B4593] text-white rounded-md hover:bg-[#223b75] transition"
            >
              + Add Event
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <img
          src="/images/hero1_mainpage.png"
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover filter brightness-75"
        />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold">Finde katholische Events</h1>
          <p className="mt-4 text-lg md:text-2xl">Entdecke und teile Veranstaltungen in deiner Nähe</p>
          <ul className="mt-6 space-y-3">
            <li className="flex items-center space-x-2">
              <Search />
              <span>Einfache Suche</span>
            </li>
            <li className="flex items-center space-x-2">
              <Calendar />
              <span>Kalenderansicht</span>
            </li>
            <li className="flex items-center space-x-2">
              <MapPin />
              <span>Ortsbasiert</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1">
        {/* Search Results Placeholder */}
        <section id="search-results" className="container mx-auto px-4 my-12">
          <h2 className="text-3xl font-semibold mb-6">Ergebnisse</h2>
          {events.length === 0
            ? <p>Keine Ergebnisse</p>
            : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {events.slice(0,12).map(evt => (
                  <EventCardSearch key={evt.id} event={evt} />
                ))}
              </div>
          }
        </section>


        {/* Highlight Section Placeholder */}
        <section id="highlights" className="container mx-auto px-4 my-12 space-y-8">
          <h2 className="text-3xl font-semibold mb-6">Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {events.slice(0, 4).map(evt => (
            <EventCardHighlight key={evt.id} event={evt} />
          ))}
          </div>
        </section>


        {/* Coming Up Events */}
        <section id="upcoming" className="container mx-auto px-4 my-12">
          <h2 className="text-3xl font-semibold mb-6">Kommende Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.slice(0,20).map(evt => (
              <EventCardGrid key={evt.id} event={evt} />
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <img src="/images/logoTaube.png" alt="Logo" className="h-10 mb-4" />
            <p className="text-gray-600">Kath-Events: Katholische Veranstaltungen im Überblick</p>
          </div>
          {/* Column 2 */}
          <div>
            <h3 className="font-semibold mb-2">Discover</h3>
            <ul className="space-y-1 text-gray-600">
              <li><Link href="#">Events</Link></li>
              <li><Link href="#">Highlights</Link></li>
              <li><Link href="#">About Us</Link></li>
            </ul>
          </div>
          {/* Column 3 */}
          <div>
            <h3 className="font-semibold mb-2">Info</h3>
            <ul className="space-y-1 text-gray-600">
              <li><Link href="#">About</Link></li>
              <li><Link href="#">Contact</Link></li>
              <li><Link href="#">Privacy</Link></li>
              <li><Link href="#">Legal</Link></li>
            </ul>
          </div>
          {/* Column 4 */}
          <div>
            <h3 className="font-semibold mb-2">Follow Us</h3>
            <div className="flex space-x-3">
              {/* TODO: Social Icons in circles */}
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Kath-Events. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
