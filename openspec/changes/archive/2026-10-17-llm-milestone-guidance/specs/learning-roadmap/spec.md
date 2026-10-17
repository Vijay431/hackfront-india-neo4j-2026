# Spec Delta

## ADDED Requirements

### Requirement: AI-written milestone descriptions
When a roadmap is generated and an AI model is configured, each milestone's description SHALL be text written by the model for that skill, the target role, and the user's profile. Each description SHALL be plain text of at most 300 characters. The model SHALL NOT change which milestones exist, their order, their target skills, or their completion state.

#### Scenario: Personalized description
- **WHEN** a configured user whose goal is a job switch picks Data Scientist
- **THEN** each milestone description is model-written text about that skill for a Data Scientist, not the template text

#### Scenario: Graph decides the route
- **WHEN** a roadmap is generated with the model configured
- **THEN** its milestones, order, and completion states match those generated without the model

### Requirement: Template fallback
When no AI model is configured, or the model call fails, times out, or returns no usable description for a milestone, that milestone's description SHALL be the template text: "Build proficiency in <skill>" for a role skill and "Prerequisite skill: <skill>" for a prerequisite. Picking a path SHALL NOT fail because of the model.

#### Scenario: No API key
- **WHEN** no AI model key is configured and a user picks a role
- **THEN** the roadmap is generated with template descriptions

#### Scenario: Model unavailable
- **WHEN** the model call errors or exceeds the timeout
- **THEN** the roadmap is generated with template descriptions and the user reaches the dashboard

#### Scenario: Partial response
- **WHEN** the model returns descriptions for only some milestones, or text over 300 characters for one
- **THEN** those milestones use the model text and the rest use the template text

### Requirement: AI request data
The request sent to the model SHALL contain only the role title, the role description, the ordered milestone skill names, and the user's profile answers. It SHALL NOT contain the user's email, password, or user id. The API key SHALL be used only on the server.

#### Scenario: No identifiers sent
- **WHEN** a roadmap is generated with the model configured
- **THEN** the request body contains no email, password, or user id, and no browser request carries the API key
