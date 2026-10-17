# Project Documentation: CareerPath AI

**Project Title:** CareerPath AI – Personalized Skill Analysis and Career Roadmap Generator  
**Document Type:** Technical Proposal & MVP Architecture Specification  

---

## 1. Executive Summary & Problem Statement

### 1.1 Problem Statement
Many students and early-career professionals aspire to enter technical roles such as AI Engineer, Machine Learning Engineer, Data Scientist, or Full-Stack Developer. However, they face significant hurdles:
* **Lack of Role Clarity:** Ambiguity regarding exact industry expectations vs. current qualifications.
* **Skill Identification Gaps:** Difficulty self-assessing practical technical depth and knowing which target roles best match existing experience.
* **Unstructured Learning Paths:** Overwhelming volume of online learning content without clear sequencing, practical projects, or milestone verification.

### 1.2 Proposed Solution
**CareerPath AI** is an intelligent career guidance platform designed to bridge the gap between academic education and industry standards. By uploading a resume or choosing a target role, users receive intelligent role recommendations and undergo a structured skill assessment. The platform performs an automated skill-gap analysis comparing current proficiency against curated, real-world industry requirements, ultimately generating a custom, project-oriented learning roadmap and tracking progress toward job readiness.

---

## 2. Core Target Roles (Phase 1 MVP)

The platform will initially support tailored skill trees, gap analysis, and learning roadmaps for four high-demand tech roles:

1. **AI Engineer**
   * *Core Competencies:* LLM integration, RAG architectures, Prompt Engineering, Vector Databases, Fine-tuning, Agentic Frameworks (e.g., LangChain, LlamaIndex), RESTful APIs, Cloud Deployment.
2. **Machine Learning (ML) Engineer**
   * *Core Competencies:* Data Preprocessing, Feature Engineering, Classical ML Algorithms, Deep Learning (PyTorch/TensorFlow), MLOps, Model Deployment (FastAPI/Docker), Model Monitoring, Distributed Training.
3. **Data Scientist**
   * *Core Competencies:* Exploratory Data Analysis (EDA), Statistical Analysis, SQL & Database Management, Data Visualization (Tableau/PowerBI/Seaborn), Python/R, Predictive Modeling, A/B Testing, Business Intelligence.
4. **Full-Stack Developer**
   * *Core Competencies:* Modern Frontend (React/Next.js/TypeScript), State Management, Backend Development (Node.js/Python FastAPI/Go), REST & GraphQL APIs, Relational/NoSQL Databases, Authentication/Security, CI/CD, DevOps basics.

---

## 3. Key Functional Features

1. **Resume-Based Role Matcher:**
   * Automated parsing of uploaded resumes (PDF/DOCX) using LLM / NLP entity extraction.
   * Compares extracted skills and experience against role matrices to recommend best-fit technical career tracks.
2. **Resume-Aligned Career Guidance Provider:**
   * Strategic advice on how to align existing resume achievements with target job descriptions.
   * Highlights transferable skills and suggests targeted resume tweaks for target job roles.
3. **Quick Skill Assessment Engine:**
   * Adaptive assessment covering prerequisites, core concepts, and tool fluency.
   * Supports both quick self-evaluation (0–5 rating scale) and adaptive diagnostic micro-quizzes to calibrate true competency.
4. **Automated Skill Gap Analysis:**
   * Graph traversal algorithms (Cypher) and AI evaluation identify missing prerequisites and core skill deficits against target role graphs.
5. **Dynamic Roadmap Generator:**
   * Step-by-step topic breakdown with estimated learning durations based on graph dependency paths.
   * Direct links to curated, authoritative learning resources (documentation, tutorials, courses).
   * Portfolio-ready hands-on project milestones for each major phase.
6. **Interactive Roadmap Tracker & Dashboard:**
   * Visual readiness scores (Overall Preparedness vs. Role Benchmark).
   * Milestone checkbox trackers and progress persistence to monitor overall completion over time.

---

## 4. System Architecture & Tech Stack

### 4.1 Chosen Tech Stack
* **Frontend & Full-Stack Framework:** Next.js (App Router, Server Actions / React Server Components, Tailwind CSS, Lucide Icons, Recharts).
* **API Layer:** GraphQL (Apollo Server / GraphQL Yoga integrated inside Next.js API Routes or standalone GraphQL endpoint).
* **Database:** Neo4j (Graph Database for modeling relationships between Users, Skills, Prerequisites, Roles, and Roadmaps using Cypher queries).
* **Document Parsing & AI Integration:** LangChain / LlamaIndex / Direct AI API SDKs (OpenAI/Anthropic/Groq) for resume entity parsing and dynamic prompt generation.

### 4.2 System Data Flow
```
[ User Uploads Resume ] ──► [ Resume Parsing & Entity Extraction ]
                                     │
                                     ▼
                     [ GraphQL API (Next.js Layer) ]
                                     │
                                     ▼
             [ Cypher Query Engine ↔ Neo4j Skill Graph ]
                                     │
                                     ▼
                      [ AI Role Matcher & Guidance ]
                                     │
                                     ▼
                       [ User Selects Target Role ] 
                                     │
                                     ▼
                   [ Quick Skill Assessment (0-5 / Quiz) ]
                                     │
                                     ▼
                [ Graph Traversal Gap Analysis Engine ]
                                     │
                                     ▼
                [ Dynamic Roadmap & Alignment Engine ]
                                     │
                                     ▼
               [ Interactive Roadmap Tracker & Dashboard ]
```

---

## 5. Database Schema & Graph Model (Neo4j Blueprint)

Using a Graph Database (Neo4j) is ideal for this application, as skills, prerequisite chains, and role requirements naturally form directed acyclic graphs (DAGs).

### 5.1 Graph Nodes
* `(:User { id, name, email, createdAt })`
* `(:Role { id, title, description, category })`
* `(:Skill { id, name, category, complexityLevel })`
* `(:Resource { id, title, url, type, isFree })`
* `(:Project { id, title, description, difficulty })`
* `(:Roadmap { id, id, createdAt, completionPercentage })`
* `(:Milestone { id, title, description, orderIndex, isCompleted })`

### 5.2 Graph Relationships
* `(:User)-[:TARGETS_ROLE]->(:Role)`
* `(:User)-[:HAS_SKILL { proficiencyScore: Int, verifiedAt: DateTime }]->(:Skill)`
* `(:Role)-[:REQUIRES_SKILL { importanceWeight: Float }]->(:Skill)`
* `(:Skill)-[:REQUIRES_PREREQUISITE]->(:Skill)` *(Models dependency graph)*
* `(:Skill)-[:HAS_RESOURCE]->(:Resource)`
* `(:Skill)-[:PRACTICED_BY]->(:Project)`
* `(:User)-[:HAS_ROADMAP]->(:Roadmap)`
* `(:Roadmap)-[:CONTAINS_MILESTONE]->(:Milestone)`
* `(:Milestone)-[:TARGETS_SKILL]->(:Skill)`

### 5.3 Sample GraphQL Schema (TypeDefs)
```graphql
type User {
  id: ID!
  name: String!
  email: String!
  targetRole: Role
  assessedSkills: [UserSkill!]!
  roadmaps: [Roadmap!]!
}

type UserSkill {
  skill: Skill!
  proficiencyScore: Int!
}

type Role {
  id: ID!
  title: String!
  description: String!
  requiredSkills: [RoleSkill!]!
}

type RoleSkill {
  skill: Skill!
  importanceWeight: Float!
}

type Skill {
  id: ID!
  name: String!
  category: String!
  prerequisites: [Skill!]!
  resources: [Resource!]!
  projects: [Project!]!
}

type Resource {
  id: ID!
  title: String!
  url: String!
  type: String!
}

type Project {
  id: ID!
  title: String!
  description: String!
  difficulty: String!
}

type Roadmap {
  id: ID!
  targetRole: Role!
  completionPercentage: Float!
  milestones: [Milestone!]!
}

type Milestone {
  id: ID!
  title: String!
  description: String!
  orderIndex: Int!
  isCompleted: Boolean!
  targetSkill: Skill
  suggestedProject: Project
  recommendedResources: [Resource!]!
}

type Query {
  me: User
  roles: [Role!]!
  role(id: ID!): Role
  skillGraph(roleId: ID!): [Skill!]!
  gapAnalysis(userId: ID!, roleId: ID!): [Skill!]!
}

type Mutation {
  uploadResume(file: String!): UserSkillAnalysis!
  submitAssessment(assessments: [SkillAssessmentInput!]!): Boolean!
  generateRoadmap(roleId: ID!): Roadmap!
  toggleMilestone(milestoneId: ID!, completed: Boolean!): Milestone!
}

input SkillAssessmentInput {
  skillId: ID!
  score: Int!
}

type UserSkillAnalysis {
  extractedSkills: [Skill!]!
  recommendedRoles: [RoleMatch!]!
  guidanceNotes: String!
}

type RoleMatch {
  role: Role!
  matchPercentage: Float!
  reasoning: String!
}
```

---

## 6. Implementation Timeline (MVP Phase)

* **Sprint 1:** 
  * Initialize Next.js project with Tailwind CSS and GraphQL endpoint (Apollo Server / Yoga API Routes).
  * Setup Neo4j instance (Neo4j AuraDB or Docker container).
  * Seed Neo4j graph nodes and relationships for the 4 core roles and skill dependency trees.
* **Sprint 2:** 
  * Build resume upload component and GraphQL mutation for processing resumes.
  * Implement LLM extraction service to parse skills and run role recommendation algorithms against the Neo4j graph.
* **Sprint 3:** 
  * Build Quick Assessment UI with interactive 0–5 skill sliders.
  * Implement Neo4j Cypher queries for skill gap identification and dependency-ordered learning paths.
  * Implement dynamic GraphQL roadmap generation.
* **Sprint 4:** 
  * Build interactive Roadmap Tracker Dashboard with milestone completion toggles and progress charts.
  * End-to-end integration testing and user interface polish.