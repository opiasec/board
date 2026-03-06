# STRIDE Methodology for C4 Models

Use this guide to identify threats based on the STRIDE framework applied to C4 components.

| Threat | Description | Component Target |
| :--- | :--- | :--- |
| **S**poofing | Pretending to be someone or something else. | Person, Software System (API) |
| **T**ampering | Modifying data or code. | Database, Message Bus, File System |
| **R**epudiation | Claiming not to have performed an action. | Manual Operations, Admin actions |
| **I**nformation Disclosure | Exposing information to unauthorized parties. | Logs, Database, Client-side apps |
| **D**enial of Service | Preventing legitimate use of the system. | HSM, API, Network Links |
| **E**levation of Privilege | Gaining unauthorized access levels. | Containers, User Sessions |

## Mapping Process

1. **Identify Assets**: What is valuable? (Tokens, Keys, PII).
2. **Analyze Flows**: Follow the `edges` (relationships).
3. **Identify Threats**: Apply STRIDE to each `node` and `edge`.
4. **Propose Controls**: How to mitigate? (MFA, TLS, Encryption, Logging).
