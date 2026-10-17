# learning-roadmap Specification

## Purpose

Turns a user's skill gaps for a target role into an ordered, trackable roadmap of milestones with learning resources and portfolio projects. A dashboard shows readiness and completion progress.

## Requirements

### Requirement: Roadmap generation
Generating a roadmap SHALL create one milestone per skill in the role's prerequisite closure: every required skill plus every transitive prerequisite. Milestones SHALL be in dependency order, prerequisites first (orderIndex starting at 1). A milestone SHALL start complete when the user's score for its skill is at or above the proficiency threshold, and incomplete otherwise. Each milestone SHALL have a title, a description, its target skill, that skill's resources, and a linked project if the skill has one.

#### Scenario: Generate after assessment
- **WHEN** a user whose profile scores Python 3 and SQL 2 picks Data Scientist
- **THEN** the roadmap contains milestones for every Data Scientist skill and its prerequisites, the Python milestone is complete, and the SQL milestone is incomplete

#### Scenario: Prerequisite before dependent
- **WHEN** the roadmap contains both JavaScript and React
- **THEN** the JavaScript milestone has a lower orderIndex than the React milestone

#### Scenario: No gaps
- **WHEN** the user's profile scores every skill in the role's closure at 3 or higher
- **THEN** every milestone starts complete and the dashboard shows the user is role-ready

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
The dashboard SHALL show the target role, the readiness score, the completion percentage, and the ordered milestones. Each milestone SHALL show its checkbox, its effort estimate, its resource links (which open in a new tab), and its project when present.

#### Scenario: View dashboard
- **WHEN** a user with a roadmap opens the dashboard
- **THEN** they see the role title, readiness, completion, and each milestone with its effort estimate and resources

#### Scenario: No roadmap yet
- **WHEN** a signed-in user with a profile but without a roadmap opens the dashboard
- **THEN** they are sent to the path picker

### Requirement: Pace estimate
The dashboard SHALL show the remaining learning hours, the days needed at the user's daily learning time, and the projected finish date. Remaining hours SHALL be the sum of effort estimates of incomplete milestones. Daily time SHALL count as 0.75, 1.5, 3.5, or 5 hours for the four answers in order.

#### Scenario: Estimate from remaining work
- **WHEN** 60 hours of incomplete milestones remain and the user answered "1–2 hours"
- **THEN** the dashboard shows 40 days and a finish date 40 days from today

#### Scenario: Estimate updates
- **WHEN** the user marks a 20-hour milestone complete and the page reloads
- **THEN** remaining hours drop by 20 and the finish date moves earlier

#### Scenario: Nothing remaining
- **WHEN** every milestone is complete
- **THEN** the dashboard shows the route as finished instead of a finish date

### Requirement: Timeline fit
The target date SHALL be the onboarding date plus the target timeline in months. When the projected finish date is later than the target date, the dashboard SHALL show a warning with the daily hours needed to finish by the target date. When the target date has passed, the warning SHALL say so instead.

#### Scenario: Plan does not fit
- **WHEN** the projected finish date is 30 days after the target date
- **THEN** a warning states the plan finishes after the target and shows the hours per day needed to finish on time

#### Scenario: Plan fits
- **WHEN** the projected finish date is on or before the target date
- **THEN** no timeline warning is shown

### Requirement: Learning-style resource order
Each milestone SHALL list resources whose type matches any of the user's chosen learning styles first: Videos→`video`, Docs / reading→`docs`, Hands-on projects→`hands-on`, Courses→`course`. Resources of other types SHALL still be listed after them. Within each group, resources SHALL follow the fixed order docs, video, course, hands-on.

#### Scenario: Video learner
- **WHEN** a user whose learning style is Videos views a milestone
- **THEN** its video resource is listed first and its docs, course, and hands-on resources follow

#### Scenario: Several styles
- **WHEN** a user whose learning styles are Videos and Hands-on projects views a milestone
- **THEN** its resources are listed as video, hands-on, docs, course

### Requirement: Profile summary
The dashboard SHALL show a read-only summary of the user's education level, skill level, daily learning time, primary goal, and target timeline.

#### Scenario: Summary shown
- **WHEN** a user with a profile opens the dashboard
- **THEN** the summary shows their education level, skill level, daily time, goal, and timeline, with no edit controls
