// src/app/api/test-oracle/route.ts

export const runtime = 'nodejs'  // ensure Node.js runtime

import { NextResponse } from 'next/server'
import oracledb from 'oracledb'
import path from 'path'

export async function GET() {
  let conn
  try {
    conn = await oracledb.getConnection({
      user:            process.env.ORACLE_USER!,
      password:        process.env.ORACLE_PASSWORD!,
      connectString:   process.env.ORACLE_CONNECTION_STRING!,
      walletLocation:  path.resolve(process.cwd(), process.env.TNS_ADMIN!),
      walletPassword:  process.env.ORACLE_WALLET_PASSWORD!  // <— use the wallet’s passphrase
    })

    const result = await conn.execute(`SELECT 'Hello Oracle' AS MSG FROM DUAL`)
    return NextResponse.json({ rows: result.rows })

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Oracle Error:', err)
    return NextResponse.json({ error: msg }, { status: 500 })

  } finally {
    if (conn) await conn.close()
  }
}
