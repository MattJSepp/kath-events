// src/app/api/events/route.ts

export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import oracledb from 'oracledb'
import path from 'path'
import type { Event } from './types'

// CLOB-Spalten gleich als native JS-Strings holen
oracledb.fetchAsString = [ oracledb.CLOB ]

export async function GET() {
  let conn
  try {
    conn = await oracledb.getConnection({
      user:           process.env.ORACLE_USER!,
      password:       process.env.ORACLE_PASSWORD!,
      connectString:  process.env.ORACLE_CONNECTION_STRING!,
      walletLocation: path.resolve(process.cwd(), process.env.TNS_ADMIN!),
      walletPassword: process.env.ORACLE_WALLET_PASSWORD!
    })

    const result = await conn.execute(
      `SELECT id, title, description, event_date, location,
              category, organizer, image_url, created_at
       FROM events
      ORDER BY event_date`
    )

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
