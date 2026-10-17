# Spec Delta

## Purpose

Holds the canonical graph of target roles, the skills they require, prerequisite chains between skills, and the learning resources and projects attached to each skill. Every other capability reads from this graph.

## ADDED Requirements

### Requirement: Seeded role catalog
The system SHALL provide exactly five predefined MVP roles: Full-Stack Developer, Machine Learning Engineer, Data Scientist, Software Architect, and AI Engineer. Each role SHALL have a stable id, a title, and a description.

#### Scenario: List roles
- **WHEN** a client requests the list of roles
- **THEN** the system returns all five roles with id, title, and description

#### Scenario: Unknown role id
- **WHEN** a client requests a role by an id that does not exist
- **THEN** the system returns null for that role and does not error

### Requirement: Role skill requirements
Each role SHALL require at least 6 skills. Each requirement SHALL carry an importance weight between 0 and 1. A skill MAY be required by more than one role.

#### Scenario: Get a role's required skills
- **WHEN** a client requests a role's required skills
- **THEN** the system returns each skill's id, name, and category, plus the importance weight for that role

### Requirement: Skill prerequisite graph
Skills SHALL be linked by prerequisite relationships that form a directed acyclic graph. A role's prerequisite closure MAY include skills the role does not directly require.

#### Scenario: Prerequisites exposed
- **WHEN** a client requests a skill's prerequisites
- **THEN** the system returns the skills it directly depends on

#### Scenario: No cycles in seed data
- **WHEN** the seed data is loaded
- **THEN** no skill is reachable from itself along prerequisite relationships

### Requirement: Skill learning resources and projects
Every skill in a role's prerequisite closure SHALL have at least one learning resource with a title, an absolute https URL, and a type. Each role SHALL have at least one portfolio project linked to one of its skills.

#### Scenario: Resource attached
- **WHEN** a client requests a skill's resources
- **THEN** the system returns at least one resource with a valid https URL

### Requirement: Idempotent seeding
Loading the seed data SHALL be repeatable without creating duplicate roles, skills, resources, projects, or relationships. Reseeding SHALL NOT delete user data.

#### Scenario: Seed twice
- **WHEN** the seed is run twice against the same database
- **THEN** each role, skill, and relationship exists exactly once
