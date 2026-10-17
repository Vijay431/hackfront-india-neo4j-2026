import { readFileSync } from "node:fs";
import { join } from "node:path";
import { driver as createDriver, auth } from "neo4j-driver";

const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD, NEO4J_DATABASE } = process.env;
if (!NEO4J_URI || !NEO4J_USERNAME || !NEO4J_PASSWORD) {
  throw new Error("NEO4J_URI, NEO4J_USERNAME and NEO4J_PASSWORD are required");
}

const statements = readFileSync(join(process.cwd(), "scripts", "seed.cypher"), "utf8")
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

async function main() {
  const driver = createDriver(NEO4J_URI!, auth.basic(NEO4J_USERNAME!, NEO4J_PASSWORD!));
  try {
    for (const cypher of statements) {
      await driver.executeQuery(cypher, {}, { database: NEO4J_DATABASE || undefined });
    }
    console.log(`Seeded ${statements.length} statements`);
  } finally {
    await driver.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
