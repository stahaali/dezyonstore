import mysql, { type Pool, type ResultSetHeader, type RowDataPacket } from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var __dezyonMysqlPool: Pool | undefined;
}

function createPool() {
  return mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "dezyon_store",
    waitForConnections: true,
    connectionLimit: 10,
  });
}

export function getDb() {
  if (!global.__dezyonMysqlPool) {
    global.__dezyonMysqlPool = createPool();
  }
  return global.__dezyonMysqlPool;
}

export async function queryRows<T extends RowDataPacket[]>(
  sql: string,
  params: (string | number | boolean | Date | null)[] = [],
) {
  const [rows] = await getDb().query<T>(sql, params);
  return rows;
}

export async function queryExec(
  sql: string,
  params: (string | number | boolean | Date | null)[] = [],
) {
  const [result] = await getDb().execute<ResultSetHeader>(sql, params);
  return result;
}

export function newId() {
  return crypto.randomUUID();
}

export function newOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 900 + 100);
  return `DZ-${stamp}-${rand}`;
}
