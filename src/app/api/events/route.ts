// src/app/api/events/route.ts
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import oracledb from 'oracledb'
import path from 'path'
import type { Event } from './types'

interface OracleEventRow {
  ID: number
  TITLE: string
  DESCRIPTION: string | null
  EVENT_DATE: Date
  LOCATION: string | null
  CATEGORY: string | null
  ORGANIZER: string | null
  IMAGE_URL: string | null
  CREATED_AT: Date
}

// CLOB-Spalten gleich als native JS-Strings holen
oracledb.fetchAsString = [ oracledb.CLOB ]

export async function GET(request: Request) {
  // URL-Parameter auslesen
  const url       = new URL(request.url)
  const q         = url.searchParams.get('q')      ?? ''
  const loc       = url.searchParams.get('loc')    ?? ''
  const cat       = url.searchParams.get('cat')    ?? ''
  const start     = url.searchParams.get('start')  ?? ''
  const end       = url.searchParams.get('end')    ?? ''
  const idsParam  = url.searchParams.get('ids')
  const ids       = idsParam ? idsParam.split(',').map(s => Number(s)) : []

  let conn
  try {
    conn = await oracledb.getConnection({
      user:           process.env.ORACLE_USER!,
      password:       process.env.ORACLE_PASSWORD!,
      connectString:  process.env.ORACLE_CONNECTION_STRING!,
      walletLocation: path.resolve(process.cwd(), process.env.TNS_ADMIN!),
      walletPassword: process.env.ORACLE_WALLET_PASSWORD!
    })

    // Basis-SQL
    let sql = `
      SELECT id, title, description, event_date, location,
             category, organizer, image_url, created_at
        FROM events
       WHERE 1=1`
    type BindParams = Record<string, string|number>
    const binds: BindParams = {}

    // IDs-Filter (für Highlights)
    if (ids.length > 0) {
      const placeholders = ids.map((_, i) => `:id${i}`).join(', ')
      sql += ` AND id IN (${placeholders})`
      ids.forEach((val, i) => {
        binds[`id${i}`] = val
      })
    }

    // Stichwort-Suche (Title, Category, Organizer, Location)
    if (q) {
      sql += `
        AND (
          LOWER(title)     LIKE '%'||:q||'%' OR
          LOWER(category)  LIKE '%'||:q||'%' OR
          LOWER(organizer) LIKE '%'||:q||'%' OR
          LOWER(location)  LIKE '%'||:q||'%'
        )`
      binds.q = q.toLowerCase()
    }

    // Ort-Filter
    if (loc) {
      sql += ` AND LOWER(location) LIKE '%'||:loc||'%'`
      binds.loc = loc.toLowerCase()
    }

    // Kategorie-Filter (exakt)
    if (cat) {
      sql += ` AND category = :cat`
      binds.cat = cat
    }

    // Zeitraum-Start
    if (start) {
      sql += ` AND event_date >= TO_DATE(:bstart,'YYYY-MM-DD')`
      binds.bstart = start
    }

    // Zeitraum-Ende
    if (end) {
      sql += ` AND event_date <= TO_DATE(:bend,'YYYY-MM-DD')`
      binds.bend = end
    }

    // Sortierung
    sql += ` ORDER BY event_date ASC`

    // Abfrage ausführen
    const result = await conn.execute(
      sql,
      binds,
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    )

    // Ergebnisse in JS-Objekte umwandeln
    const rows = (result.rows as OracleEventRow[]) || []

    const events: Event[] = rows.map(row => ({
      id:          row.ID,
      title:       row.TITLE,
      description: row.DESCRIPTION,
      event_date:  row.EVENT_DATE.toISOString(),
      location:    row.LOCATION,
      category:    row.CATEGORY,
      organizer:   row.ORGANIZER,
      image_url:   row.IMAGE_URL,
      created_at:  row.CREATED_AT.toISOString(),
    }))

    return NextResponse.json({ events })

  } catch (err: unknown) {
    console.error('GET /api/events Error:', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  } finally {
    if (conn) await conn.close()
  }
}

export async function POST(request: Request) {
  let conn
  try {
    const body = (await request.json()) as Omit<Event, 'id' | 'created_at'>
    conn = await oracledb.getConnection({
      user:           process.env.ORACLE_USER!,
      password:       process.env.ORACLE_PASSWORD!,
      connectString:  process.env.ORACLE_CONNECTION_STRING!,
      walletLocation: path.resolve(process.cwd(), process.env.TNS_ADMIN!),
      walletPassword: process.env.ORACLE_WALLET_PASSWORD!
    })

    await conn.execute(
      `INSERT INTO events
         (title, description, event_date, location, category, organizer, image_url)
       VALUES
         (:t, :d, :e, :l, :c, :o, :i)`,
      {
        t: body.title,
        d: body.description,
        e: new Date(body.event_date),
        l: body.location,
        c: body.category,
        o: body.organizer,
        i: body.image_url
      }
    )
    await conn.commit()
    return NextResponse.json({}, { status: 201 })

  } catch (err: unknown) {
    console.error('POST /api/events Error:', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  } finally {
    if (conn) await conn.close()
  }
}
