## Components

### Current architecture

```mermaid
flowchart LR
    B[Browser] -->|HTTPS| F([Frontend Server<br/>with Next Auth])
    F --> BM(Base Module)
    F --> FM1(Business Module 1)
    F --> FM2(Business Module 2)
    FM1 --> BM
    FM2 --> BM
```

### New architecture

```mermaid
flowchart LR
    B[Browser] -->|HTTPS| RP(Reverse Proxy)
    RP --> AS{{Auth Service}}
    RP --> F([Frontend Server<br/>Next.js])
    RP --> BM(Base Module)
    RP --> FM1(Business Module 1)
    RP --> FM2(Business Module 2)
    FM1 --> BM
    FM2 --> BM
    style AS fill:#aadab4
```

### New version (more details)

```mermaid
flowchart LR
    B[Browser] -->|HTTPS| RP(Reverse Proxy)
    RP -- ① URL authorized? --> AS{{Auth Service}}
    AS -. ② yes/no .-> RP
    AS --- R[(Redis)]
    RP -- ③ “proxy pass” --> RPd{URL based\ndecision}
    RPd --> F([Frontend Server<br/>Next.js])
    RPd --> BM(Base Module)
    RPd --> FM1(Business Module 1)
    RPd --> FM2(Business Module 2)
    subgraph backend: /api
    BM --- BMDB[(DB)]
    FM1 ---> BM
    FM2 ---> BM
    FM1 --- FM1DB[(DB)]
    FM2 --- FM2DB[(DB)]
    end
    style AS fill:#aadab4
```

### New version (communication)

```mermaid
flowchart LR
    B[Browser] -->|HTTPS| RPd(Reverse Proxy)
    RPd --> RP{URL based\ndecision}
    RP -->|mTLS| AS{{Auth Service}}
    RP --->|mTLS| F([Frontend Server])
    RP -->|mTLS| BM(Base Module)
    RP -->|mTLS| FM1(Business Module 1)
    RP -->|mTLS| FM2(Business Module 2)
    FM1 -->|mTLS| BM
    FM2 -->|mTLS| BM
    RP --->|mTLS| K(Keycloak)
    AS --->|mTLS| K
    BM --->|mTLS| K
    FM1 --->|mTLS| K
    FM2 --->|mTLS| K
```

## Login Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor B as Browser
    participant RP as Reverse Proxy<br/>(Nginx)
    participant A as Auth Service<br/>(Spring Boot)
    participant F as Frontend Server<br/>(Next.js)
    participant K as Keycloak
    Note over B,RP: New login / no cookies
    B ->>+ RP: GET /
    RP ->>+ A: (auth_request)<br/>GET /check
    A ->> A: Spring Security
    A -->>- RP: HTTP 401 with redirect to /auth/keycloak<br/>SESSION cookie
    RP -->>- B: HTTP 302 redirect to /auth/keycloak<br/>SESSION cookie
    Note over B,K: Login flow starts
    B ->>+ RP: GET /auth/keycloak
    RP ->>+ A: (proxy_pass)<br/>GET /auth/keycloak
    A ->> A: Generate state / nonce
    A -->>- RP: HTTP 302 redirect to Keycloak URL<br/>state and nonce in query params
    RP -->>- B: HTTP 302

    B ->>+ RP: GET /keycloak/…/openid-connect…
    RP ->>+ K: GET /keycloak/…/openid-connect…
    K -->>- RP: Login page
    RP -->> B: Login page
    activate B
    B ->> B: User enters username/password
    B ->>+ RP: POST /keycloak/…login…
    deactivate B
    RP ->>+ K: POST /…login…
    K -->>- RP: HTTP 302 redirect to /auth/login/keycloak with authorization_code
    RP -->>- B: HTTP 302 redirect
    B ->>+ RP: GET /auth/login/keycloak
    RP ->>+ A: (proxy_pass)<br/>GET /auth/login/keycloak
    A ->>+ K: POST /…/protocol/openid-connect/token<br/>Send authorization_code
    K -->>- A: Return access- and refresh token
    A ->> A: Store access- and refresh token in session
    A -->>- RP: HTTP 302 redirect to /
    RP -->>- B: HTTP 302 redirect to /
    Note over B,K: Login flow finished
    B ->>+ RP: GET /<br/>SESSION=abc
    RP ->>+ A: (auth request)<br/>GET /check<br/>SESSION=abc<br/>X-Original-URI: /
    A ->> A: Resolve session<br/>Resolve role from access token<br/>Check permissions with lib-security-config
    A -->>- RP: HTTP 200<br/>Authorization: Bearer …
    RP ->>+ F: (proxy_pass)<br/>GET /<br/>Authorization: Bearer …
    F -->>- RP: HTTP 200<br/>Dashboard page
    RP -->>- B: HTTP 200<br/>Dashboard page
```

## Backend Access Sequence Diagram
```mermaid
sequenceDiagram
    autonumber
    actor B as Browser
    participant RP as Reverse Proxy<br/>(Nginx)
    participant A as Auth Service<br/>(Spring Boot)
    participant SE as School Entry Module
    B ->>+ RP: GET /api/school-entry/school-entries<br/>SESSION=abc
    RP ->>+ A: (auth request)<br/>GET /check<br/>SESSION=abc<br/>X-Original-URI: /api/school-entry/school-entries
    A ->> A: Resolve session<br/>Resolve role from access token<br/>Check permissions with lib-security-config
    A -->>- RP: HTTP 200<br/>Authorization: Bearer …
    RP ->>+ SE: (proxy_pass)<br/>GET /<br/>Authorization: Bearer …
    SE -->>- RP: HTTP 200<br/>JSON
    RP -->>- B: HTTP 200<br/>JSON
```

## Logout
```mermaid
sequenceDiagram
    actor B as Browser
    participant RP as Reverse Proxy<br/>(Nginx)
    participant A as Auth Service<br/>(Spring Boot)
    participant K as Keycloak
    B ->>+ RP: GET /logout/keycloak<br/>SESSION=abc
    RP ->>+ A: GET /logout/keycloak<br/>SESSION=abc
    A -->>- RP: HTTP 302<br/>Location: /keycloak/…/logout?…
    RP -->>- B: HTTP 302<br/>JSON
    B ->>+ RP: /keycloak/…/logout?…
    RP ->>+ K: GET /realms/…/logout?…
    K -->>- RP: HTTP 200<br/>Logout confirmation page
    RP -->>- B: Logout confirmation page
    activate B
    B ->> B: Confirm logout
    B ->>+ RP: /keycloak/…/logout/logout-confirm?…
    deactivate B
    RP ->>+ K: /keycloak/…/logout/logout-confirm?…
    K ->> K: Remove the session
    K -->>- RP: HTTP 302: /logout
    RP -->>- B: HTTP 302: /logout
    B ->>+ RP: GET /logout
    RP ->>+ A: GET /logout
    A ->> A: Remove the session
    A -->>- RP: HTTP 302: /
    RP -->>- B: HTTP 302: /
```
