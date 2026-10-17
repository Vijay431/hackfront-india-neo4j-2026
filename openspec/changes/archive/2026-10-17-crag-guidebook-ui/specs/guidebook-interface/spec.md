# Spec Delta

## Purpose

Defines the shared interface shell and the visible states of the assessment and roadmap screens, so the dependency-ordered route of a roadmap is readable at a glance and every screen is usable by keyboard and on phones.

## ADDED Requirements

### Requirement: Persistent navigation
Every page SHALL show a header with the product name linking to the role list and navigation links to the role list and to the user's roadmap.

#### Scenario: Navigate from roadmap
- **WHEN** the user is on the roadmap page and activates the "Roles" link
- **THEN** the role list page opens

#### Scenario: Unknown route
- **WHEN** the user opens an unknown role id
- **THEN** a not-found page with the header and a link back to the role list is shown

### Requirement: Role list presentation
The home page SHALL list the five roles in a fixed numbered order with title and description, each linking to that role's assessment, and SHALL show a placeholder while roles load.

#### Scenario: Roles loaded
- **WHEN** the home page finishes loading
- **THEN** five roles are listed, each as a link to its assessment page

#### Scenario: Roles loading
- **WHEN** the role query has not yet returned
- **THEN** five placeholder rows are shown and marked busy

### Requirement: Named proficiency levels
Each skill rating control SHALL display the current score together with its level name: 0 None, 1 Aware, 2 Learning, 3 Proficient, 4 Strong, 5 Expert, and SHALL visually distinguish scores at or above the proficiency threshold of 3.

#### Scenario: Reach threshold
- **WHEN** the user moves a skill rating from 2 to 3
- **THEN** the control shows "3 Proficient" in the completed style

#### Scenario: Assistive technology
- **WHEN** a screen reader focuses a rating control
- **THEN** it announces the skill name, the score out of 5, and the level name

### Requirement: Reachable assessment submit
The assessment page SHALL keep its submit action visible while the user scrolls through the skill list, and SHALL state that unrated skills count as 0.

#### Scenario: Long skill list
- **WHEN** the skill list is taller than the viewport
- **THEN** the "Build my roadmap" action remains visible without scrolling to the end

### Requirement: Route-style roadmap
The roadmap SHALL render milestones in order along a single vertical route. Each milestone SHALL show its order number, skill name, description, resources, and linked project if any, and SHALL tag prerequisite milestones. The route segment after a milestone SHALL read as completed when that milestone is complete and as pending otherwise.

#### Scenario: Mixed progress
- **WHEN** milestones 1 and 2 are complete and 3 is not
- **THEN** the route segments after 1 and 2 show completed and the segment after 3 shows pending

#### Scenario: Prerequisite milestone
- **WHEN** a milestone is a prerequisite of a gap skill
- **THEN** it carries a visible "Prerequisite" tag

### Requirement: Progress summary
The roadmap SHALL show readiness and completion percentages as numbers and as labelled progress bars exposing their value to assistive technology.

#### Scenario: Complete a milestone
- **WHEN** the user marks a milestone complete
- **THEN** the checkbox updates immediately and the completion percentage reflects the saved state after the update

### Requirement: Accessible, responsive controls
All interactive controls SHALL have visible keyboard focus, accessible names, and SHALL remain usable at 390px viewport width without horizontal page scroll. Decorative animation SHALL NOT run when the user prefers reduced motion.

#### Scenario: Phone width
- **WHEN** any page is viewed at 390px wide
- **THEN** content fits the viewport width and every action is reachable

#### Scenario: Reduced motion
- **WHEN** the user prefers reduced motion
- **THEN** the home diagram route line is drawn statically with no animation
