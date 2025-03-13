import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

console.log("🛠️ Loaded ENV:", process.env.DB_HOST)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS, 
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
})
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
export const db = drizzle(pool, { schema, mode: "default" });
