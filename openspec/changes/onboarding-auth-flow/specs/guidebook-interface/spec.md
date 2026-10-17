# Spec Delta

## MODIFIED Requirements

### Requirement: Persistent navigation
Every page SHALL show a header with the product name. For a signed-in user the header SHALL also show links to "Change path" (the path picker) and "My roadmap", the signed-in email, and a "Log out" action. A signed-out visitor SHALL see only the product name.

#### Scenario: Navigate from roadmap
- **WHEN** the user is on the roadmap page and activates the "Change path" link
- **THEN** the path picker opens

#### Scenario: Unknown route
- **WHEN** the user opens an unknown URL
- **THEN** a not-found page with the header and a link back to the home page is shown

#### Scenario: Signed out
- **WHEN** a signed-out visitor views the sign-in page
- **THEN** the header shows the product name and no navigation links or "Log out"

### Requirement: Accessible, responsive controls
All interactive controls SHALL have visible keyboard focus, accessible names, and SHALL remain usable at 390px viewport width without horizontal page scroll. Decorative animation SHALL NOT run when the user prefers reduced motion.

#### Scenario: Phone width
- **WHEN** any page is viewed at 390px wide
- **THEN** content fits the viewport width and every action is reachable

#### Scenario: Reduced motion
- **WHEN** the user prefers reduced motion
- **THEN** the sign-in page diagram route line is drawn statically with no animation

## ADDED Requirements

### Requirement: Sign-in screen
The sign-in page SHALL show a short product explanation and the prerequisite-chain diagram beside the email and password form. On narrow screens the form SHALL come first.

#### Scenario: Wide layout
- **WHEN** the sign-in page is viewed at 1440px wide
- **THEN** the explanation and diagram sit beside the form

#### Scenario: Narrow layout
- **WHEN** the sign-in page is viewed at 390px wide
- **THEN** the form is above the explanation

### Requirement: Onboarding screen
The questionnaire SHALL show one question at a time with a "Question N of 9" progress indicator. Options SHALL be large selectable controls grouped with their question label, so keyboard and screen-reader users can operate them.

#### Scenario: Progress shown
- **WHEN** the user is on the fourth question
- **THEN** the screen shows "Question 4 of 9" and a progress bar at the matching position

#### Scenario: Keyboard selection
- **WHEN** a keyboard user tabs to an option and presses Space
- **THEN** the option is selected

### Requirement: Path picker screen
The path picker SHALL look like a chat assistant: a greeting prompt, a chat composer below it, and one chip per role below the composer. The composer SHALL show a search icon, a text input, a voice-input button, and a send button. The whole composer SHALL be visibly grayed out, disabled, and labelled as coming soon. Activating a chip SHALL build that role's roadmap and open it. While it builds, the chosen chip SHALL show a busy state and other chips SHALL be disabled.

#### Scenario: Chips shown
- **WHEN** the path picker opens
- **THEN** six role chips are shown below a grayed-out chat composer marked "coming soon" with search, voice, and send controls

#### Scenario: Locked chat
- **WHEN** the user tries to type in the chat input, or activates the voice or send button
- **THEN** no text is entered, no voice capture starts, and nothing is sent

#### Scenario: Pick a path
- **WHEN** the user activates the "Forward Deployed Engineer" chip
- **THEN** the chip shows a busy state and the Forward Deployed Engineer roadmap opens

### Requirement: Pre-checked milestones on the route
Milestones that start complete because of the profile SHALL look the same as milestones the user completed, so the route reads solid through known skills.

#### Scenario: Known skill on route
- **WHEN** a roadmap opens with the Python milestone pre-checked
- **THEN** the Python checkbox is checked and the route segment after it shows completed

## REMOVED Requirements

### Requirement: Role list presentation
**Reason**: The home page now routes by user state, and roles are chosen from the path picker chips.
**Migration**: Use the path picker at `/path`.

### Requirement: Named proficiency levels
**Reason**: The slider assessment that used named levels is removed.
**Migration**: Proficiency comes from the onboarding questionnaire; see `skill-assessment`.

### Requirement: Reachable assessment submit
**Reason**: The slider assessment page is removed.
**Migration**: The onboarding questionnaire has its own Back/Next and submit controls; see "Onboarding screen".
