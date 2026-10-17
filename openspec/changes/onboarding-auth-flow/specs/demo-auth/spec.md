# Spec Delta

## Purpose

Identifies a user by email through a demo sign-in with no password verification, and routes each signed-in user to the next step of the flow: onboarding, path picking, or their roadmap.

## ADDED Requirements

### Requirement: Demo sign-in
The sign-in page SHALL accept an email and a password. Any well-formed email with a non-empty password SHALL sign the user in. The email, trimmed and lower-cased, SHALL be the user id. The password SHALL NOT be verified, stored, or logged. The page SHALL state that it is a demo sign-in.

#### Scenario: First sign-in
- **WHEN** a visitor signs in with "Asha@Example.com " and any non-empty password
- **THEN** a user with id "asha@example.com" exists and the visitor is signed in as that user

#### Scenario: Returning sign-in
- **WHEN** a visitor signs in with an email that already has a profile and roadmap
- **THEN** the visitor is signed in as that existing user and sees that user's saved roadmap

#### Scenario: Invalid input
- **WHEN** a visitor submits a malformed email or an empty password
- **THEN** sign-in fails with a field-level error message and no session is created

### Requirement: Session cookie
A successful sign-in SHALL set an httpOnly, SameSite=Lax cookie holding the user id, and every user-scoped page and API request SHALL identify the user from that cookie.

#### Scenario: Session persists
- **WHEN** a signed-in user reloads any page
- **THEN** they remain signed in as the same user

### Requirement: Signed-out access
A request for any app page other than sign-in without a session SHALL redirect to the sign-in page. A user-scoped API request without a session SHALL fail with an error and change nothing.

#### Scenario: Protected page
- **WHEN** a signed-out visitor opens the roadmap page
- **THEN** they are redirected to the sign-in page

#### Scenario: Protected API
- **WHEN** a request without a session calls the roadmap API
- **THEN** the API returns a "No user session" error

### Requirement: Sign-out
A signed-in user SHALL be able to sign out from the header. Signing out SHALL clear the session cookie and show the sign-in page. Saved data SHALL remain and be shown again on the next sign-in with the same email.

#### Scenario: Log out
- **WHEN** a signed-in user activates "Log out"
- **THEN** the session cookie is cleared and the sign-in page is shown

### Requirement: State-based routing
After sign-in, and whenever a signed-in user opens the home page, the system SHALL send a user without a profile to onboarding, a user with a profile but no roadmap to the path picker, and a user with a roadmap to the roadmap. A signed-in user opening the sign-in page SHALL be sent to the same destination.

#### Scenario: New user
- **WHEN** a user with no profile signs in
- **THEN** the onboarding questionnaire opens

#### Scenario: Profile without roadmap
- **WHEN** a user who finished onboarding but never picked a path opens the home page
- **THEN** the path picker opens

#### Scenario: Existing roadmap
- **WHEN** a user with a roadmap signs in
- **THEN** the roadmap page opens
