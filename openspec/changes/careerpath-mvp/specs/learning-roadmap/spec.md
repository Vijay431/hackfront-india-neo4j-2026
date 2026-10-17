# Spec Delta

## Purpose

Turns a user's skill gaps for a target role into an ordered, trackable roadmap of milestones with learning resources and portfolio projects. A dashboard shows readiness and completion progress.

## ADDED Requirements

### Requirement: Roadmap generation
Generating a roadmap SHALL create one milestone per gap skill, in gap-list order (orderIndex starting at 1). Each milestone SHALL have a title, a description, its target skill, that skill's resources, and a linked project if the skill has one.

#### Scenario: Generate after assessment
- **WHEN** the user submits an assessment with 5 gap skills and generates a roadmap
- **THEN** the roadmap has 5 milestones ordered by the gap list, all incomplete

#### Scenario: No gaps
- **WHEN** the user has no gap skills
- **THEN** the roadmap has zero milestones and the dashboard shows the user is role-ready

### Requirement: One active roadmap per user
A user SHALL have at most one roadmap. Generating a new roadmap SHALL replace the previous roadmap and its milestones.

#### Scenario: Regenerate
- **WHEN** a user with an existing roadmap submits a new assessment and generates again
- **THEN** only the new roadmap exists for that user

### Requirement: Milestone completion tracking
A user SHALL be able to mark any of their milestones complete or incomplete. The change SHALL persist across reloads. A user SHALL NOT be able to change another user's milestone.

#### Scenario: Toggle milestone
- **WHEN** the user checks a milestone and reloads the page
- **THEN** the milestone is still shown as complete

#### Scenario: Foreign milestone
- **WHEN** a request toggles a milestone that does not belong to the requesting user
- **THEN** the system rejects it with an error and changes nothing

### Requirement: Completion percentage
The roadmap completion percentage SHALL equal completed milestones divided by total milestones, times 100, rounded to a whole number. It SHALL be 100 when there are zero milestones.

#### Scenario: Partial completion
- **WHEN** 2 of 5 milestones are complete
- **THEN** completion is 40

### Requirement: Roadmap dashboard
The dashboard SHALL show the target role, the readiness score, the completion percentage, and the ordered milestones. Each milestone SHALL show its checkbox, its resource links (which open in a new tab), and its project when present.

#### Scenario: View dashboard
- **WHEN** a user with a roadmap opens the dashboard
- **THEN** they see the role title, readiness, completion, and each milestone with its resources

#### Scenario: No roadmap yet
- **WHEN** a user without a roadmap opens the dashboard
- **THEN** they are told to pick a role and are linked to the role picker
