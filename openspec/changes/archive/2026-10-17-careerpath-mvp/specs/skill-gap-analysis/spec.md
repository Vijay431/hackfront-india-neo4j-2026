# Spec Delta

## Purpose

Compares a user's assessed skills against a target role's requirements through the skill graph. It finds deficient skills and missing prerequisites, and it measures how ready the user is for the role.

## ADDED Requirements

### Requirement: Proficiency threshold
A skill SHALL count as proficient when the user's score is 3 or higher. An unrated skill SHALL count as score 0.

#### Scenario: Score at threshold
- **WHEN** the user rated a required skill 3
- **THEN** that skill is not in the gap list

### Requirement: Gap detection
The gap list for a user and role SHALL contain every required skill below the threshold. It SHALL also contain every transitive prerequisite of those skills that is below the threshold. Each skill SHALL appear at most once.

#### Scenario: Deficient required skill
- **WHEN** the user rated "RAG Architectures" 1 for AI Engineer
- **THEN** "RAG Architectures" appears in the gap list

#### Scenario: Missing prerequisite pulled in
- **WHEN** "RAG Architectures" is a gap and its prerequisite "Vector Databases" is unrated or below 3
- **THEN** "Vector Databases" also appears in the gap list, even if the role does not directly require it

#### Scenario: Prerequisite already known
- **WHEN** a gap skill's prerequisite is rated 4
- **THEN** that prerequisite does not appear in the gap list

#### Scenario: Fully proficient
- **WHEN** every required skill is rated 3 or higher
- **THEN** the gap list is empty

### Requirement: Dependency ordering
The gap list SHALL be ordered so that every skill appears after all of its prerequisites in the list. Ties SHALL be broken by higher importance weight first, then by skill name.

#### Scenario: Prerequisite before dependent
- **WHEN** both "Python" and its dependent "Deep Learning" are gaps
- **THEN** "Python" appears before "Deep Learning"

### Requirement: Readiness score
The system SHALL compute a readiness score from 0 to 100: the importance-weighted average of `score / 5` across the role's required skills, times 100, rounded to a whole number.

#### Scenario: All zeros
- **WHEN** every required skill is rated 0
- **THEN** readiness is 0

#### Scenario: All fives
- **WHEN** every required skill is rated 5
- **THEN** readiness is 100
