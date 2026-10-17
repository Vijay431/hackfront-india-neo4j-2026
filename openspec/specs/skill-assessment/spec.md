# skill-assessment Specification

## Purpose

Lets a user pick a target role and rate their proficiency in that role's skills on a 0–5 scale. The ratings are stored as the user's skill profile for gap analysis.

## Requirements

### Requirement: Anonymous user identity
The system SHALL give each browser a persistent anonymous user id the first time it makes a user-scoped request, and SHALL reuse that id on later requests. The id SHALL be stored in an httpOnly cookie. No login SHALL be required.

#### Scenario: First visit
- **WHEN** a browser without a user cookie submits an assessment
- **THEN** the system creates a user, sets the cookie, and links the assessment to that user

#### Scenario: Returning visit
- **WHEN** a browser with an existing user cookie loads its roadmap
- **THEN** the system returns that user's saved data

### Requirement: Target role selection
A user SHALL be able to choose one target role. Choosing a new role SHALL replace the previous target role.

#### Scenario: Select role
- **WHEN** the user picks "AI Engineer" on the role picker
- **THEN** the system records AI Engineer as the user's target role and shows that role's assessment

### Requirement: Self-rating of required skills
The assessment SHALL list every skill the target role requires and let the user rate each one with an integer from 0 to 5. Each skill SHALL default to 0.

#### Scenario: Submit ratings
- **WHEN** the user submits ratings for the role's skills
- **THEN** the system stores each rating as the user's proficiency for that skill and overwrites any earlier rating for the same skill

#### Scenario: Out-of-range score rejected
- **WHEN** a client submits a score below 0, above 5, or not an integer
- **THEN** the system rejects the whole submission with a validation error and stores nothing

#### Scenario: Unknown skill rejected
- **WHEN** a client submits a rating for a skill id that does not exist
- **THEN** the system rejects the submission with a validation error
