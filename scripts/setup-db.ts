import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import postgres from "postgres";
import { seedPortfolio, seedTestimonials } from "../src/lib/seed-data";

type Sql = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<Record<string, unknown>[]>;

type Runner = {
  sql: Sql;
  execute: (statement: string) => Promise<void>;
  close: () => Promise<void>;
};

function statements(sqlText: string) {
  return sqlText
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);
}

function isNeonDatabase(url: string) {
  return new URL(url).hostname.endsWith(".neon.tech");
}

function createRunner(url: string): Runner {
  if (!isNeonDatabase(url)) {
    const pg = postgres(url, { max: 1 });
    return {
      sql: (strings, ...values) =>
        pg(strings, ...(values as never[])) as unknown as Promise<
          Record<string, unknown>[]
        >,
      execute: async (statement) => {
        await pg.unsafe(statement);
      },
      close: () => pg.end(),
    };
  }

  const query = neon(url);
  return {
    sql: (strings, ...values) =>
      query(strings, ...values) as Promise<Record<string, unknown>[]>,
    execute: async (statement) => {
      await query.query(statement);
    },
    close: async () => {},
  };
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const schema = readFileSync(new URL("./schema.sql", import.meta.url), "utf8");
  const runner = createRunner(url);

  try {
    for (const statement of statements(schema)) {
      await runner.execute(statement);
    }

    const portfolioCount = await runner.sql`SELECT count(*)::int AS count FROM portfolio_items`;
    if (Number(portfolioCount[0]?.count ?? 0) === 0) {
      for (const item of seedPortfolio) {
        await runner.sql`
          INSERT INTO portfolio_items (
            id, video_id, color, title_en, title_he, sort_order, hidden
          )
          VALUES (
            ${item.id},
            ${item.videoId},
            ${item.color},
            ${item.titleEn},
            ${item.titleHe},
            ${item.sortOrder},
            ${item.hidden}
          )
        `;
      }
      console.log(`Seeded ${seedPortfolio.length} portfolio items`);
    } else {
      console.log("Portfolio already has rows, skipping seed");
    }

    const testimonialCount = await runner.sql`SELECT count(*)::int AS count FROM testimonials`;
    if (Number(testimonialCount[0]?.count ?? 0) === 0) {
      for (const item of seedTestimonials) {
        await runner.sql`
          INSERT INTO testimonials (
            id, color, quote_en, quote_he, name_en, name_he, role_en, role_he,
            sort_order, hidden
          )
          VALUES (
            ${item.id},
            ${item.color},
            ${item.quoteEn},
            ${item.quoteHe},
            ${item.nameEn},
            ${item.nameHe},
            ${item.roleEn},
            ${item.roleHe},
            ${item.sortOrder},
            ${item.hidden}
          )
        `;
      }
      console.log(`Seeded ${seedTestimonials.length} testimonials`);
    } else {
      console.log("Testimonials already have rows, skipping seed");
    }
  } finally {
    await runner.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
