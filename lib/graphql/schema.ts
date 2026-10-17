import { GraphQLError } from "graphql";
import { createSchema } from "graphql-yoga";
import * as career from "../career";

export type GraphQLContext = { uid: string | null };

function requireUid(ctx: GraphQLContext): string {
  if (!ctx.uid) throw new GraphQLError("No user session");
  return ctx.uid;
}

const typeDefs = /* GraphQL */ `
  type Role { id: ID!, title: String!, description: String!, skills: [RoleSkill!]! }
  type Skill { id: ID!, name: String! }
  type RoleSkill { id: ID!, name: String!, category: String!, importanceWeight: Float!, prerequisites: [Skill!]! }
  type Resource { id: ID!, title: String!, url: String!, type: String! }
  type Project { id: ID!, title: String!, description: String!, difficulty: String! }
  type GapSkill { id: ID!, name: String!, category: String!, weight: Float!, isPrerequisite: Boolean! }
  type GapAnalysis { gaps: [GapSkill!]!, readiness: Int! }
  type Milestone {
    id: ID!, title: String!, description: String!, orderIndex: Int!, isCompleted: Boolean!
    isPrerequisite: Boolean!, skill: Skill!, resources: [Resource!]!, project: Project
  }
  type Roadmap { role: Role!, readiness: Int!, completionPercentage: Int!, milestones: [Milestone!]! }
  input SkillScoreInput { skillId: ID!, score: Int! }

  type Query {
    roles: [Role!]!
    role(id: ID!): Role
    gapAnalysis(roleId: ID!): GapAnalysis!
    myRoadmap: Roadmap
  }
  type Mutation {
    submitAssessment(roleId: ID!, assessments: [SkillScoreInput!]!): Boolean!
    generateRoadmap(roleId: ID!): Roadmap
    toggleMilestone(milestoneId: ID!, completed: Boolean!): Boolean!
  }
`;

// Role.skills is resolved lazily so listing roles stays a single cheap query.
const roleSkills = async (role: { id: string }) => (await career.getRole(role.id))?.skills ?? [];

export const schema = createSchema<GraphQLContext>({
  typeDefs,
  resolvers: {
    Role: { skills: roleSkills },
    Query: {
      roles: () => career.listRoles(),
      role: (_, { id }) => career.getRole(id),
      gapAnalysis: async (_, { roleId }, ctx) => {
        const uid = requireUid(ctx);
        const [gaps, readiness] = await Promise.all([
          career.gapAnalysis(uid, roleId),
          career.readiness(uid, roleId),
        ]);
        return { gaps: gaps.map((g) => ({ ...g, isPrerequisite: g.weight === 0 })), readiness };
      },
      myRoadmap: (_, __, ctx) => career.getMyRoadmap(requireUid(ctx)),
    },
    Mutation: {
      submitAssessment: async (_, { roleId, assessments }, ctx) => {
        await career.submitAssessment(requireUid(ctx), roleId, assessments);
        return true;
      },
      generateRoadmap: async (_, { roleId }, ctx) => {
        const uid = requireUid(ctx);
        await career.generateRoadmap(uid, roleId);
        return career.getMyRoadmap(uid);
      },
      toggleMilestone: async (_, { milestoneId, completed }, ctx) => {
        await career.toggleMilestone(requireUid(ctx), milestoneId, completed);
        return true;
      },
    },
  },
});
