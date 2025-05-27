'use client'
import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Sliders } from 'lucide-react'

export default function SearchBar() {
  const router = useRouter()
  const [keyword, setKeyword]   = useState('')
  const [location, setLocation] = useState('')
  const keywordRef = useRef<HTMLInputElement>(null)
  const locRef     = useRef<HTMLInputElement>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [category,    setCategory]    = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate,   setEndDate]   = useState<string>('')



  function handleSearch(term?: string) {
    const q   = term ?? keyword
    const loc = location
    const params = new URLSearchParams()
    if (q)   params.set('q', q)
    if (loc) params.set('loc', loc)
    router.push(`/?${params.toString()}`)
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    handleSearch()
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center space-x-2 p-4 bg-white rounded-full shadow">
      {/* Lupen-Icon */}
      <button
        type="button"
        onClick={() => {
          // Immer Suche auslösen
          handleSearch()
          // zusätzlich Fokus ins Keyword-Feld, wenn noch nichts eingegeben
          if (!keyword && !location) {
            keywordRef.current?.focus()
          }
        }}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <Search size={20} />
      </button>

      {/* Keyword-Input */}
      <input
        ref={keywordRef}
        type="text"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        placeholder="Suche nach Events"
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault()
            handleSearch()
          }
        }}
        className="flex-1 px-2 py-1 outline-none rounded-full"
      />

      {/* Trennlinie */}
      <div className="w-px h-6 bg-gray-300" />

      {/* MapPin-Icon */}
      <button
        type="button"
        onClick={() => locRef.current?.focus()}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <MapPin size={20} />
      </button>

      {/* Location-Input */}
      <input
        ref={locRef}
        type="text"
        value={location}
        onChange={e => setLocation(e.target.value)}
        placeholder="Ort (z. B. Bayern)"
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault()
            handleSearch()
          }
        }}
        className="flex-1 px-2 py-1 outline-none rounded-full"
      />

      {/* Trennlinie */}
      <div className="w-px h-6 bg-gray-300" />

      {/* Filter/Sliders-Icon */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsFilterOpen(open => !open)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <Sliders size={20} />
        </button>
        {isFilterOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border rounded shadow-lg p-4 z-50">
          <h4 className="font-medium mb-2">Beliebte Kategorien</h4>
          <div className="flex flex-wrap gap-2">
            {['Gottesdienst','Pilgerfahrt','Konzert','Seminar'].map(catName => (
              <button
                key={catName}
                onClick={() => { setCategory(catName); setIsFilterOpen(false) }}
                className={`px-2 py-1 text-sm rounded-full ${category===catName ? 'bg-[#2B4593] text-white' : 'bg-gray-100'}`}
              >
                {catName}
              </button>
            ))}
          </div>

          {/* Datumsauswahl */}
          <div className="mt-4">
            <label className="block text-xs">Von</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
            />
            <label className="block text-xs mt-2">Bis</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>
          </div>
        )}
      </div>


    </form>
  )
}
