import "server-only";

import { neon } from "@neondatabase/serverless";
import postgres from "postgres";

export type Sql = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<Record<string, unknown>[]>;

let cached: Sql | undefined;

function isLocalDatabase(url: string) {
  const hostname = new URL(url).hostname;
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function getSql(): Sql {
  if (cached) return cached;

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  // The Neon HTTP driver only speaks to Neon hosts. Local Postgres uses a
  // single TCP connection with the same tagged-template call shape.
  if (isLocalDatabase(url)) {
    const pg = postgres(url, { max: 1, idle_timeout: 1 });
    cached = (strings, ...values) =>
      pg(strings, ...(values as never[])) as unknown as Promise<
        Record<string, unknown>[]
      >;
    return cached;
  }

  const query = neon(url);
  cached = (strings, ...values) =>
    query(strings, ...values) as Promise<Record<string, unknown>[]>;
  return cached;
}
