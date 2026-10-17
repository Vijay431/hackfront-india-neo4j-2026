# skill-assessment Specification

## Purpose

Lets a user pick a target role and rate their proficiency in that role's skills on a 0–5 scale. The ratings are stored as the user's skill profile for gap analysis.

## Requirements

### Requirement: Target role selection
A user SHALL be able to choose one target role from the path picker. Choosing a role SHALL record it as the user's target role, replace any previous target role, and build that role's roadmap from the user's profile.

#### Scenario: Select role
- **WHEN** the user picks the "AI Engineer" chip on the path picker
- **THEN** the system records AI Engineer as the user's target role and shows the AI Engineer roadmap

#### Scenario: Change role
- **WHEN** a user with a Data Scientist roadmap picks "Forward Deployed Engineer"
- **THEN** the target role becomes Forward Deployed Engineer and only its roadmap exists for the user

### Requirement: Onboarding questionnaire
A user without a profile SHALL answer one onboarding questionnaire of nine questions, one at a time, with Back and Next. Every question SHALL require at least one answer. Single-choice questions SHALL accept exactly one. Multi-select questions SHALL allow several answers. On the known-skills and tools questions, "None yet" SHALL exclude the others; the learning-style question has no "None yet". The full option lists are in the Question set requirement.

#### Scenario: Complete onboarding
- **WHEN** a new user answers all nine questions and submits
- **THEN** the profile is saved and the path picker opens

#### Scenario: Missing answer
- **WHEN** the user tries to advance past any question, single-choice or multi-select, without choosing an option
- **THEN** the questionnaire stays on that question and explains that an answer is required

#### Scenario: Several learning styles
- **WHEN** the user selects "Videos" and "Hands-on projects" on the learning-style question and submits
- **THEN** the saved profile lists both learning styles

#### Scenario: Exclusive "None yet"
- **WHEN** the user selects "None yet" after selecting "Python" on the known-skills question
- **THEN** "Python" is deselected and only "None yet" remains selected

### Requirement: Question set
The questionnaire SHALL ask exactly nine questions in a fixed order, each with exactly the options listed in its scenarios.

#### Scenario: Background questions
- **WHEN** the user starts onboarding
- **THEN** question 1 is education level (1st Year, 2nd Year, 3rd Year, 4th Year, Graduate / Working Professional) and question 2 is technical skill level (Beginner, Intermediate, Advanced)

#### Scenario: Skill questions
- **WHEN** the user reaches questions 3 and 4
- **THEN** question 3 is known skills, multi-select (Python, Java, C / C++, HTML / CSS / JavaScript, TypeScript, Node.js, HTTP / Web fundamentals, SQL / DBMS, Database Design, Data Structures and Algorithms (DSA), OOP / Design Patterns, Statistics & Probability, Linear Algebra, Pandas / NumPy, Data Visualization, Machine Learning, Deep Learning, NLP / LLMs, System Design, Git / GitHub, None yet) and question 4 is tools, multi-select (Linux, Docker, Cloud (AWS / GCP / Azure), React, REST APIs, CI/CD, None yet)

#### Scenario: Experience and goal questions
- **WHEN** the user reaches questions 5 to 7
- **THEN** they are hands-on experience (None, 1–2 projects, 3+ projects), primary goal (Internship, First job, Career switch, Upskill in current role), and target timeline (3 months, 6 months, 12 months)

#### Scenario: Pace and style questions
- **WHEN** the user reaches questions 8 and 9
- **THEN** they are daily learning time (Less than 1 hour, 1–2 hours, 3–4 hours, More than 4 hours) and learning style, multi-select (Videos, Docs / reading, Hands-on projects, Courses)

### Requirement: Profile storage
The system SHALL store the submitted answers as the user's profile together with the time onboarding finished. The profile SHALL be readable by the user's own session only. Submitted values outside the listed options SHALL be rejected with a validation error and nothing stored.

#### Scenario: Invalid option rejected
- **WHEN** a client submits learning styles of ["podcasts"]
- **THEN** the submission fails with a validation error and no profile is stored

#### Scenario: Empty answer rejected
- **WHEN** a client submits an empty list of learning styles
- **THEN** the submission fails with a validation error and no profile is stored

#### Scenario: Read own profile
- **WHEN** a signed-in user requests their profile
- **THEN** the system returns that user's saved answers

### Requirement: Onboarding runs once
A user who already has a profile SHALL NOT be shown the questionnaire again. Opening the onboarding page with a profile SHALL redirect to the path picker or the roadmap.

#### Scenario: Revisit onboarding
- **WHEN** a user with a profile opens the onboarding page
- **THEN** they are redirected and the questionnaire is not shown

### Requirement: Profile-derived proficiency
Saving a profile SHALL set the user's skill proficiency scores from the known-skills and tools answers, replacing earlier scores. Each answer maps to one or more graph skills. Beginner scores mapped fundamentals (skills with no prerequisites) 3 and other mapped skills 2. Intermediate scores mapped skills 3, and Advanced scores them 4. Unmapped skills have no score.

#### Scenario: Beginner fundamentals only
- **WHEN** a Beginner selects "Python" and "React"
- **THEN** Python (no prerequisites) is scored 3 and React is scored 2

#### Scenario: Beginner math fundamental
- **WHEN** a Beginner selects "Statistics & Probability" and "Pandas / NumPy"
- **THEN** Statistics (no prerequisites) is scored 3 and Pandas & NumPy is scored 2

#### Scenario: Intermediate
- **WHEN** an Intermediate user selects "HTML / CSS / JavaScript"
- **THEN** HTML/CSS and JavaScript are both scored 3

#### Scenario: None yet
- **WHEN** the user selects "None yet" for both known skills and tools
- **THEN** the user has no skill scores

### Requirement: Experience fills prerequisites
When the hands-on experience answer is 3+ projects, every transitive prerequisite of a mapped skill scored 3 or higher SHALL also be scored at least 3.

#### Scenario: Prerequisites credited
- **WHEN** an Intermediate user with 3+ projects selects "React" only
- **THEN** React, JavaScript, and HTML/CSS are all scored at least 3

#### Scenario: No credit without experience
- **WHEN** an Intermediate user with 1–2 projects selects "React" only
- **THEN** React is scored 3 and JavaScript and HTML/CSS have no score
