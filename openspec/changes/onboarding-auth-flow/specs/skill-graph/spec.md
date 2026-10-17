# Spec Delta

## MODIFIED Requirements

### Requirement: Seeded role catalog
The system SHALL provide exactly six predefined roles: Full-Stack Developer, Machine Learning Engineer, Data Scientist, Software Architect, AI Engineer, and Forward Deployed Engineer. Each role SHALL have a stable id, a title, and a description.

#### Scenario: List roles
- **WHEN** a client requests the list of roles
- **THEN** the system returns all six roles with id, title, and description

#### Scenario: Unknown role id
- **WHEN** a client requests a role by an id that does not exist
- **THEN** the system returns null for that role and does not error

#### Scenario: Forward Deployed Engineer skills
- **WHEN** a client requests the Forward Deployed Engineer role
- **THEN** its required skills include Python, SQL, REST APIs, Docker, Linux, Data Pipelines, and Solutions Engineering

### Requirement: Skill learning resources and projects
Every skill in a role's prerequisite closure SHALL have at least one resource of each type `docs`, `video`, `course`, and `hands-on`, each with a title and an absolute https URL. Each role SHALL have at least one portfolio project linked to one of its skills.

#### Scenario: Resource attached
- **WHEN** a client requests a skill's resources
- **THEN** the system returns at least one resource with a valid https URL

#### Scenario: All resource types
- **WHEN** a client requests the resources of any skill in any role's prerequisite closure
- **THEN** the result contains at least one resource of each of the four types

## ADDED Requirements

### Requirement: Questionnaire skills in the graph
Every skill the onboarding questionnaire can map to SHALL exist in the skill graph, including HTML/CSS, Java, C/C++, Data Structures and Algorithms, Linux, Cloud Basics, and CI/CD.

#### Scenario: Mapped skill exists
- **WHEN** the seed has run and a user selects "Data Structures and Algorithms (DSA)"
- **THEN** a matching skill exists and receives the user's score

### Requirement: Skill effort estimate
Every skill SHALL carry a positive estimate of the learning hours needed to reach proficiency.

#### Scenario: Estimate present
- **WHEN** a client reads any skill on a roadmap
- **THEN** it has an effort estimate greater than zero hours
