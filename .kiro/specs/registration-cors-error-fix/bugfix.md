# Bugfix Requirements Document

## Introduction

The CashWise application registration flow is failing for all users attempting to register from the frontend running on http://localhost:5174. The issue manifests as two distinct but related problems:

1. **CORS Policy Violation**: The backend SecurityConfig only allows CORS requests from http://localhost:5173 and http://localhost:3000, but the frontend is actually running on http://localhost:5174, causing all registration requests to be blocked by the browser's CORS policy before reaching the server.

2. **Generic Error Handling**: The Register.jsx component's StepOne function catches all errors with a generic catch block and always displays "Email already exists" regardless of the actual error (CORS, network, validation, or duplicate email), making it impossible for users to understand the real problem.

This bug prevents any new user registration and provides misleading error messages that obscure the root cause.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a user attempts to register from http://localhost:5174 THEN the browser blocks the request with a CORS policy error and no request reaches the backend

1.2 WHEN any error occurs during registration (CORS, network, validation, or actual duplicate email) THEN the system displays "Email already exists" regardless of the actual error type

1.3 WHEN the CORS error occurs THEN the user sees "Email already exists" in the UI while the browser console shows "Access to XMLHttpRequest at 'http://localhost:8080/api/auth/register' from origin 'http://localhost:5174' has been blocked by CORS policy"

### Expected Behavior (Correct)

2.1 WHEN a user attempts to register from http://localhost:5174 THEN the system SHALL allow the CORS preflight request and process the registration normally

2.2 WHEN a CORS error occurs during registration THEN the system SHALL display an error message indicating a connection or configuration issue (not "Email already exists")

2.3 WHEN a network error occurs during registration THEN the system SHALL display an error message indicating a network or server connectivity issue

2.4 WHEN the backend returns a duplicate email error THEN the system SHALL display "Email already exists"

2.5 WHEN the backend returns a validation error THEN the system SHALL display the specific validation error message from the server

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user attempts to register from http://localhost:5173 or http://localhost:3000 THEN the system SHALL CONTINUE TO allow CORS requests as before

3.2 WHEN a user provides valid registration data (unique email, valid password, required fields) THEN the system SHALL CONTINUE TO create the account successfully and proceed to step 2

3.3 WHEN a user provides invalid data (missing fields, short password) THEN the system SHALL CONTINUE TO display client-side validation errors before making the API call

3.4 WHEN registration succeeds THEN the system SHALL CONTINUE TO store the token and user data in localStorage and advance to the card linking step
