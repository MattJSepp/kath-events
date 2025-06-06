import React, { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Calendar, MapPin } from 'lucide-react'

import SearchBar        from '@/components/SearchBar'
import Spinner          from '@/components/Spinner'
import EventList        from '@/components/EventList'
import HighlightEvents  from '@/components/HighlightEvents'
import ComingUpEvents   from '@/components/ComingUpEvents'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage({
  searchParams
}: {
  // ❗️ ausschliesslich Promise, kein Union mehr
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  // 1) erst auflösen
  const resolved = await searchParams

  // 2) Helper zum Reduzieren möglicher string-Arrays
  const getSingle = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v

  // 3) jetzt destrukturieren
  const q     = getSingle(resolved.q)
  const loc   = getSingle(resolved.loc)
  const cat   = getSingle(resolved.cat)
  const start = getSingle(resolved.start)
  const end   = getSingle(resolved.end)

  const isSearching = Boolean(q || loc || cat || start || end)

  // 4) nur saubere strings an EventList übergeben
  const listParams: Record<string,string> = {}
  if (q)     listParams.q     = q
  if (loc)   listParams.loc   = loc
  if (cat)   listParams.cat   = cat
  if (start) listParams.start = start
  if (end)   listParams.end   = end


  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 bg-white shadow z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image src="/images/logoTaube.png" alt="Logo" width={48} height={48} className="h-12 w-12" />
            <span className="text-2xl font-bold text-[#2B4593]">Katholische Events</span>
          </div>
          <div className="flex-1 px-4">
            <SearchBar />
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
      <section className="relative h-[40vh] w-full">
        <Image
          src="/images/hero1_mainpage4k.png"
          alt="Hero background"
          fill
          className="absolute inset-0 w-full h-full object-cover filter brightness-75"
          priority
        />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold">Finde katholische Events</h1>
          <p className="mt-4 text-lg md:text-2xl">Entdecke und teile Veranstaltungen in deiner Nähe</p>
          <ul className="mt-6 space-y-3">
            <li className="flex items-center space-x-2"><Search /><span>Einfache Suche</span></li>
            <li className="flex items-center space-x-2"><Calendar /><span>Kalenderansicht</span></li>
            <li className="flex items-center space-x-2"><MapPin /><span>Ortsbasiert</span></li>
          </ul>
        </div>
      </section>

      {/* Main-Section immer sichtbar, EventList bei Suche oben */}
      <main className="flex-1">
        {isSearching && (
          <div className="mb-8">
            <Suspense fallback={<Spinner />}>
              <EventList searchParams={listParams} />
            </Suspense>
          </div>
        )}


        {/* Highlight-Section */}
        <Suspense fallback={<Spinner />}>
          <HighlightEvents />
        </Suspense>

        {/* Coming Up Events */}
        <Suspense fallback={<Spinner />}>
          <ComingUpEvents />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <Image src="/images/logoTaube.png" alt="Logo" width={40} height={40} className="h-10 mb-4" />
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
