# Bugfix Requirements Document

## Introduction

The Spring Boot application crashes on startup when processing requests due to a CORS configuration conflict. The error occurs because controller-level `@CrossOrigin(origins = "*")` annotations conflict with the global CORS configuration that has `allowCredentials(true)`. According to CORS specification, when credentials are allowed, the wildcard "*" cannot be used for allowed origins - specific origins must be declared instead.

This bug affects the CashWise personal finance application's ability to handle authenticated requests from the React frontend (running on localhost:5173 or localhost:3000).

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the application starts and processes a request with `@CrossOrigin(origins = "*")` on a controller AND the global CORS config has `allowCredentials(true)` THEN the system crashes with error "When allowCredentials is true, allowedOrigins cannot contain the special value '*' since that cannot be set on the 'Access-Control-Allow-Origin' response header"

1.2 WHEN AuthController or TestController receives a request THEN the system applies the controller-level `@CrossOrigin(origins = "*")` annotation which overrides the correct global WebConfig settings

### Expected Behavior (Correct)

2.1 WHEN the application starts and processes requests THEN the system SHALL use the global CORS configuration from WebConfig.java with specific origin patterns (localhost:5173, localhost:3000) and allowCredentials(true) without crashing

2.2 WHEN AuthController or TestController receives a request THEN the system SHALL apply CORS settings that allow specific origins with credentials enabled, not the wildcard "*"

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a request comes from http://localhost:5173 or http://localhost:3000 THEN the system SHALL CONTINUE TO allow the request with credentials

3.2 WHEN CORS configuration specifies allowed methods (GET, POST, PUT, DELETE, PATCH, OPTIONS) THEN the system SHALL CONTINUE TO permit these HTTP methods

3.3 WHEN CORS configuration specifies allowed headers and exposed headers THEN the system SHALL CONTINUE TO apply these header configurations correctly

3.4 WHEN the maxAge is set to 3600 seconds THEN the system SHALL CONTINUE TO cache preflight responses for this duration
