

/* eslint-disable @typescript-eslint/no-explicit-any */
/* ODER NUR: declare module 'oracledb'
    Dann musseslint hier auch nicht deaktiviert werden*/
declare module 'oracledb' {
  const oracledb: any
  export = oracledb
}
