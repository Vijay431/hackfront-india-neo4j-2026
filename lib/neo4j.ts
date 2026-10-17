import neo4j, { type Driver } from "neo4j-driver";

const globalForNeo4j = globalThis as unknown as { neo4jDriver?: Driver };

function getDriver(): Driver {
  if (!globalForNeo4j.neo4jDriver) {
    const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;
    if (!NEO4J_URI || !NEO4J_USERNAME || !NEO4J_PASSWORD) {
      throw new Error("NEO4J_URI, NEO4J_USERNAME and NEO4J_PASSWORD are required");
    }
    globalForNeo4j.neo4jDriver = neo4j.driver(
      NEO4J_URI,
      neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD),
      { disableLosslessIntegers: true },
    );
  }
  return globalForNeo4j.neo4jDriver;
}

export type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export async function run(
  cypher: string,
  params: Record<string, unknown> = {},
  access: "READ" | "WRITE" = "READ",
): Promise<Row[]> {
  const { records } = await getDriver().executeQuery(cypher, params, {
    database: process.env.NEO4J_DATABASE || undefined,
    routing: access === "READ" ? "READ" : "WRITE",
  });
  return records.map((r) => r.toObject());
}

/** Run several statements in one write transaction. */
export async function runWriteTx(
  work: (tx: (cypher: string, params?: Record<string, unknown>) => Promise<Row[]>) => Promise<void>,
): Promise<void> {
  const session = getDriver().session({ database: process.env.NEO4J_DATABASE || undefined });
  try {
    await session.executeWrite(async (tx) => {
      await work(async (cypher, params = {}) => {
        const res = await tx.run(cypher, params);
        return res.records.map((r) => r.toObject());
      });
    });
  } finally {
    await session.close();
  }
}
