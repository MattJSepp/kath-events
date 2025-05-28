'use client'
import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Sliders, Trash2 } from 'lucide-react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { de } from 'date-fns/locale/de'
import 'react-datepicker/dist/react-datepicker.css'

registerLocale('de', de)

export default function SearchBar() {
  const router = useRouter()
  const [keyword, setKeyword]     = useState('')
  const [location, setLocation]   = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [category, setCategory]   = useState<string>('')
  const [startDateObj, setStartDateObj] = useState<Date | null>(null)
  const [endDateObj, setEndDateObj]     = useState<Date | null>(null)
  const [openPicker, setOpenPicker]     = useState<'start' | 'end' | null>(null)

  const keywordRef = useRef<HTMLInputElement>(null)
  const locRef     = useRef<HTMLInputElement>(null)

  const hasSearch   = Boolean(keyword || location || category || startDateObj || endDateObj)
  const hasLocation = Boolean(location)
  const hasFilter   = Boolean(category || startDateObj || endDateObj)

  function handleSearch(term?: string) {
    const q         = term ?? keyword
    const locParam  = location
    const catParam  = category
    const startParam= startDateObj ? startDateObj.toISOString().split('T')[0] : ''
    const endParam  = endDateObj   ? endDateObj.toISOString().split('T')[0]   : ''

    const params = new URLSearchParams()
    if (q)          params.set('q', q)
    if (locParam)   params.set('loc', locParam)
    if (catParam)   params.set('cat', catParam)
    if (startParam) params.set('start', startParam)
    if (endParam)   params.set('end', endParam)

    router.push(`/?${params.toString()}`)
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    handleSearch()
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center space-x-2 p-4 bg-white rounded-full shadow relative">
      {/* Such-Icon */}
      <button
        type="button"
        onClick={() => {
          handleSearch()
          if (!hasSearch) keywordRef.current?.focus()
        }}
        className={`p-2 rounded-full ${hasSearch ? 'bg-[#2B4593] text-white' : 'hover:bg-gray-500'}`}
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
        className="flex-1 px-2 py-1 outline-none rounded-full text-gray-500"
      />

      <div className="w-px h-6 bg-gray-300" />

      {/* Orts-Icon */}
      <button
        type="button"
        onClick={() => locRef.current?.focus()}
        className={`p-2 rounded-full ${hasLocation ? 'bg-[#2B4593] text-white' : 'hover:bg-gray-500'}`}
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
        className="flex-1 px-2 py-1 outline-none rounded-full text-gray-500"
      />

      <div className="w-px h-6 bg-gray-300" />

      {/* Filter-Icon + Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsFilterOpen(o => !o)}
          className={`p-2 rounded-full ${hasFilter ? 'bg-[#2B4593] text-white' : 'hover:bg-gray-500'}`}
        >
          <Sliders size={20} />
        </button>

        {isFilterOpen && (
          <div className="absolute top-full right-0 mt-2 w-56 bg-white border rounded shadow-lg p-4 z-50">
            <h4 className="font-medium mb-2 text-gray-500">Beliebte Kategorien</h4>
            <div className="flex flex-wrap gap-2">
              {['Gottesdienst', 'Pilgerfahrt', 'Konzert', 'Seminar'].map(catName => (
                <button
                  key={catName}
                  type="button"
                  onClick={() => {
                    setCategory(prev => (prev === catName ? '' : catName))
                  }}
                  className={`px-2 py-1 text-sm rounded-full ${
                    category === catName ? 'bg-[#2B4593] text-white' : 'bg-gray-300'
                  }`}
                >
                  {catName}
                </button>
              ))}
            </div>

            {/* Datumsauswahl */}
            <div className="mt-4">
              <h4 className="font-medium mb-2 text-gray-500">Zeitraum</h4>
                        
              {/* Start */}
              <div className="flex items-center justify-between">
                <label className="text-xs">Von</label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setOpenPicker(prev => (prev === 'start' ? null : 'start'))}
                    className="text-sm text-blue-600"
                  >
                    {startDateObj
                      ? startDateObj.toLocaleDateString()
                      : 'Datum wählen'}
                  </button>
                  {startDateObj && (
                    <button
                      type="button"
                      onClick={() => setStartDateObj(null)}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              {openPicker === 'start' && (
                <DatePicker
                  inline
                  selected={startDateObj}
                  onChange={(date: Date | null) => {
                    setStartDateObj(date)
                    setOpenPicker(null)
                  }}
                  minDate={new Date()}
                  maxDate={endDateObj || undefined}
                  locale="de"
                  dayClassName={d => {
                    if (startDateObj && d.getTime() === startDateObj.getTime()) {
                      return 'react-datepicker__day--custom-start'
                    }
                    if (endDateObj && d.getTime() === endDateObj.getTime()) {
                      return 'react-datepicker__day--custom-end'
                    }
                    return ''
                  }}
                />
              )}
            
              {/* Ende */}
              <div className="flex items-center justify-between mt-2">
                <label className="text-xs">Bis</label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setOpenPicker(prev => (prev === 'end' ? null : 'end'))}
                    className="text-sm text-blue-600"
                  >
                    {endDateObj
                      ? endDateObj.toLocaleDateString()
                      : 'Datum wählen'}
                  </button>
                  {endDateObj && (
                    <button
                      type="button"
                      onClick={() => setEndDateObj(null)}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              {openPicker === 'end' && (
                <DatePicker
                  inline
                  selected={endDateObj}
                  onChange={(date: Date | null) => {
                    setEndDateObj(date)
                    setOpenPicker(null)
                  }}
                  minDate={startDateObj || new Date()}
                  locale="de"
                  dayClassName={d => {
                    if (startDateObj && d.getTime() === startDateObj.getTime()) {
                      return 'react-datepicker__day--custom-start'
                    }
                    if (endDateObj && d.getTime() === endDateObj.getTime()) {
                      return 'react-datepicker__day--custom-end'
                    }
                    return ''
                  }}
                />
              )}
            </div>




          </div>
        )}
      </div>
    </form>
  )
}
