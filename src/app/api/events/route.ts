// src/app/api/events/route.ts
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import oracledb from 'oracledb'
import path from 'path'
import type { Event } from './types'

// CLOB-Spalten gleich als native JS-Strings holen
oracledb.fetchAsString = [ oracledb.CLOB ]

export async function GET(request: Request) {
  // URL-Parameter auslesen (ungelesene werden später implementiert)
  const url      = new URL(request.url)
  const q       = url.searchParams.get('q')      // Stichwort (bisher ungenutzt)
  const loc     = url.searchParams.get('loc')    // Ort (bisher ungenutzt)
  const cat     = url.searchParams.get('cat')    // Kategorie (bisher ungenutzt)
  const start   = url.searchParams.get('start')  // Zeitraum-Start (bisher ungenutzt)
  const end     = url.searchParams.get('end')    // Zeitraum-Ende (bisher ungenutzt)
  const idsParam = url.searchParams.get('ids')    
  const ids      = idsParam ? idsParam.split(',').map(s => Number(s)) : []

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
    let sql = `SELECT id, title, description, event_date, location,
                      category, organizer, image_url, created_at
                 FROM events
                WHERE 1=1`
    type BindParams = Record<string, string|number>
    const binds: BindParams = {}

    // IDs-Filter (für Highlights)
    if (ids.length > 0) {
      const placeholders = ids.map((_, i) => `:id${i}`).join(', ')
      sql += ` AND id IN (${placeholders})`
      ids.forEach((val, i) => { binds[`id${i}`] = val })
    }

    // TODO: harte Filter für _q, _loc, _cat, _start, _end einbauen
    sql += ` ORDER BY event_date ASC`

    // Abfrage ausführen
    const result = await conn.execute(sql, binds)

    // Ergebnisse in JS-Objekte umwandeln
    const rows = (result.rows as unknown[][]) || []
    const events: Event[] = rows.map(arr => {
      const [
        id, title, description, event_date,
        location, category, organizer,
        image_url, created_at
      ] = arr as [
        number, string, string|null, Date,
        string|null, string|null, string|null,
        string|null, Date
      ]
      return {
        id,
        title,
        description,
        event_date:  event_date.toISOString(),
        location,
        category,
        organizer,
        image_url,
        created_at:  created_at.toISOString()
      }
    })

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
