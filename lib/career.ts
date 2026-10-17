import { GraphQLError } from "graphql";
import { randomUUID } from "node:crypto";
import { run, runWriteTx } from "./neo4j";

export const PROFICIENCY_THRESHOLD = 3;

export type Role = { id: string; title: string; description: string };
export type Resource = { id: string; title: string; url: string; type: string };
export type Project = { id: string; title: string; description: string; difficulty: string };
export type RoleSkill = {
  id: string;
  name: string;
  category: string;
  importanceWeight: number;
  prerequisites: { id: string; name: string }[];
};
export type RoleDetail = Role & { skills: RoleSkill[] };
export type GapSkill = { id: string; name: string; category: string; weight: number; prereqs: string[] };
export type Milestone = {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  isCompleted: boolean;
  isPrerequisite: boolean;
  skill: { id: string; name: string };
  resources: Resource[];
  project: Project | null;
};
export type MyRoadmap = {
  role: Role;
  readiness: number;
  completionPercentage: number;
  milestones: Milestone[];
};
export type SkillScore = { skillId: string; score: number };

export async function listRoles(): Promise<Role[]> {
  return (await run(
    `MATCH (r:Role) RETURN r.id AS id, r.title AS title, r.description AS description ORDER BY r.title`,
  )) as Role[];
}

export async function getRole(id: string): Promise<RoleDetail | null> {
  const rows = await run(
    `MATCH (r:Role {id: $id})
     OPTIONAL MATCH (r)-[req:REQUIRES_SKILL]->(s:Skill)
     OPTIONAL MATCH (s)-[:REQUIRES_PREREQUISITE]->(p:Skill)
     WITH r, s, req, collect(p {.id, .name}) AS prerequisites
     ORDER BY req.importanceWeight DESC, s.name
     RETURN r.id AS id, r.title AS title, r.description AS description,
            collect(CASE WHEN s IS NULL THEN null ELSE
              {id: s.id, name: s.name, category: s.category,
               importanceWeight: req.importanceWeight, prerequisites: prerequisites} END) AS skills`,
    { id },
  );
  if (rows.length === 0) return null;
  const { skills, ...role } = rows[0];
  return { ...(role as Role), skills: (skills as (RoleSkill | null)[]).filter((s) => s !== null) };
}

export async function submitAssessment(uid: string, roleId: string, scores: SkillScore[]): Promise<void> {
  for (const { skillId, score } of scores) {
    if (!Number.isInteger(score) || score < 0 || score > 5) {
      throw new GraphQLError(`Invalid score for ${skillId}: must be an integer from 0 to 5`);
    }
  }
  const ids = [...new Set(scores.map((s) => s.skillId))];
  const [{ roleCount, skillCount }] = await run(
    `OPTIONAL MATCH (r:Role {id: $roleId}) WITH count(r) AS roleCount
     OPTIONAL MATCH (s:Skill) WHERE s.id IN $ids
     RETURN roleCount, count(s) AS skillCount`,
    { roleId, ids },
  );
  if (roleCount === 0) throw new GraphQLError(`Unknown role: ${roleId}`);
  if (skillCount !== ids.length) throw new GraphQLError("Unknown skill id in assessment");

  await run(
    `MERGE (u:User {id: $uid})
       ON CREATE SET u.createdAt = datetime()
     WITH u
     OPTIONAL MATCH (u)-[old:TARGETS_ROLE]->()
     DELETE old
     WITH DISTINCT u
     MATCH (r:Role {id: $roleId})
     MERGE (u)-[:TARGETS_ROLE]->(r)
     WITH u
     UNWIND $scores AS sc
     MATCH (s:Skill {id: sc.skillId})
     MERGE (u)-[hs:HAS_SKILL]->(s)
     SET hs.proficiencyScore = sc.score, hs.verifiedAt = datetime()`,
    { uid, roleId, scores },
    "WRITE",
  );
}

/** Kahn's algorithm over the gap set: prerequisites first, ties by weight desc then name. */
export function orderGaps(skills: GapSkill[]): GapSkill[] {
  const inSet = new Set(skills.map((s) => s.id));
  const remaining = new Map(skills.map((s) => [s.id, { ...s, prereqs: s.prereqs.filter((p) => inSet.has(p)) }]));
  const done = new Set<string>();
  const ordered: GapSkill[] = [];
  while (remaining.size > 0) {
    const ready = [...remaining.values()].filter((s) => s.prereqs.every((p) => done.has(p)));
    if (ready.length === 0) throw new Error("Prerequisite cycle in skill graph");
    ready.sort((a, b) => b.weight - a.weight || a.name.localeCompare(b.name));
    const next = ready[0];
    ordered.push(next);
    done.add(next.id);
    remaining.delete(next.id);
  }
  return ordered;
}

export async function gapAnalysis(uid: string, roleId: string): Promise<GapSkill[]> {
  const rows = await run(
    `CALL () {
       MATCH (:Role {id: $roleId})-[:REQUIRES_SKILL]->(s:Skill)
       OPTIONAL MATCH (:User {id: $uid})-[hs:HAS_SKILL]->(s)
       WITH s, hs WHERE coalesce(hs.proficiencyScore, 0) < $threshold
       RETURN s
       UNION
       MATCH (:Role {id: $roleId})-[:REQUIRES_SKILL]->(d:Skill)
       OPTIONAL MATCH (:User {id: $uid})-[hd:HAS_SKILL]->(d)
       WITH d, hd WHERE coalesce(hd.proficiencyScore, 0) < $threshold
       MATCH (d)-[:REQUIRES_PREREQUISITE*1..]->(s:Skill)
       OPTIONAL MATCH (:User {id: $uid})-[hp:HAS_SKILL]->(s)
       WITH s, hp WHERE coalesce(hp.proficiencyScore, 0) < $threshold
       RETURN s
     }
     OPTIONAL MATCH (:Role {id: $roleId})-[req:REQUIRES_SKILL]->(s)
     OPTIONAL MATCH (s)-[:REQUIRES_PREREQUISITE]->(pre:Skill)
     RETURN s.id AS id, s.name AS name, s.category AS category,
            coalesce(req.importanceWeight, 0) AS weight,
            [x IN collect(DISTINCT pre.id) WHERE x IS NOT NULL] AS prereqs`,
    { uid, roleId, threshold: PROFICIENCY_THRESHOLD },
  );
  return orderGaps(rows as GapSkill[]);
}

export async function readiness(uid: string, roleId: string): Promise<number> {
  const [{ num, den }] = await run(
    `MATCH (:Role {id: $roleId})-[req:REQUIRES_SKILL]->(s:Skill)
     OPTIONAL MATCH (:User {id: $uid})-[hs:HAS_SKILL]->(s)
     RETURN sum(req.importanceWeight * coalesce(hs.proficiencyScore, 0) / 5.0) AS num,
            sum(req.importanceWeight) AS den`,
    { uid, roleId },
  );
  return den > 0 ? Math.round((num / den) * 100) : 0;
}

export async function generateRoadmap(uid: string, roleId: string): Promise<void> {
  if (!(await getRole(roleId))) throw new GraphQLError(`Unknown role: ${roleId}`);
  const gaps = await gapAnalysis(uid, roleId);
  const milestones = gaps.map((g, i) => ({
    id: randomUUID(),
    skillId: g.id,
    title: `Learn ${g.name}`,
    description: g.weight === 0 ? `Prerequisite skill: ${g.name}` : `Build proficiency in ${g.name}`,
    orderIndex: i + 1,
  }));
  await runWriteTx(async (tx) => {
    await tx(
      `MERGE (u:User {id: $uid})
       WITH u
       OPTIONAL MATCH (u)-[:HAS_ROADMAP]->(old:Roadmap)
       OPTIONAL MATCH (old)-[:CONTAINS_MILESTONE]->(m:Milestone)
       DETACH DELETE m, old`,
      { uid },
    );
    await tx(
      `MATCH (u:User {id: $uid})
       CREATE (u)-[:HAS_ROADMAP]->(rm:Roadmap {id: $rid, createdAt: datetime()})
       WITH rm
       UNWIND $milestones AS m
       MATCH (s:Skill {id: m.skillId})
       CREATE (rm)-[:CONTAINS_MILESTONE]->
         (:Milestone {id: m.id, title: m.title, description: m.description,
                      orderIndex: m.orderIndex, isCompleted: false})-[:TARGETS_SKILL]->(s)`,
      { uid, rid: randomUUID(), milestones },
    );
    await tx(
      `MATCH (u:User {id: $uid}) OPTIONAL MATCH (u)-[old:TARGETS_ROLE]->() DELETE old
       WITH DISTINCT u MATCH (r:Role {id: $roleId}) MERGE (u)-[:TARGETS_ROLE]->(r)`,
      { uid, roleId },
    );
  });
}

export async function getMyRoadmap(uid: string): Promise<MyRoadmap | null> {
  const rows = await run(
    `MATCH (u:User {id: $uid})-[:HAS_ROADMAP]->(rm:Roadmap)
     MATCH (u)-[:TARGETS_ROLE]->(r:Role)
     OPTIONAL MATCH (rm)-[:CONTAINS_MILESTONE]->(m:Milestone)-[:TARGETS_SKILL]->(s:Skill)
     OPTIONAL MATCH (s)-[:HAS_RESOURCE]->(res:Resource)
     OPTIONAL MATCH (s)-[:PRACTICED_BY]->(p:Project)
     OPTIONAL MATCH (r)-[req:REQUIRES_SKILL]->(s)
     WITH r, m, s, req,
          collect(DISTINCT res {.id, .title, .url, .type}) AS resources,
          head(collect(DISTINCT p {.id, .title, .description, .difficulty})) AS project
     ORDER BY m.orderIndex
     RETURN r {.id, .title, .description} AS role, m {.*} AS m, s {.id, .name} AS skill,
            req IS NULL AS isPrerequisite, resources, project`,
    { uid },
  );
  if (rows.length === 0) return null;
  const role = rows[0].role as Role;
  const milestones: Milestone[] = rows
    .filter((r) => r.m !== null)
    .map((r) => ({
      id: r.m.id,
      title: r.m.title,
      description: r.m.description,
      orderIndex: r.m.orderIndex,
      isCompleted: r.m.isCompleted,
      isPrerequisite: r.isPrerequisite,
      skill: r.skill,
      resources: r.resources,
      project: r.project ?? null,
    }));
  const done = milestones.filter((m) => m.isCompleted).length;
  return {
    role,
    readiness: await readiness(uid, role.id),
    completionPercentage: milestones.length === 0 ? 100 : Math.round((done / milestones.length) * 100),
    milestones,
  };
}

export async function toggleMilestone(uid: string, milestoneId: string, completed: boolean): Promise<void> {
  const rows = await run(
    `MATCH (:User {id: $uid})-[:HAS_ROADMAP]->(:Roadmap)-[:CONTAINS_MILESTONE]->(m:Milestone {id: $milestoneId})
     SET m.isCompleted = $completed
     RETURN m.id AS id`,
    { uid, milestoneId, completed },
    "WRITE",
  );
  if (rows.length === 0) throw new GraphQLError("Milestone not found");
}
