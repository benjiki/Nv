// src/prismaClient.ts
import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient, UserRoles, LoanStatus } from "./generated/prisma/index.js";


const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });


export { UserRoles, LoanStatus, prisma };
