\# Security Policy



\## Supported Versions



| Version | Supported          |

|---------|-------------------|

| 1.0.x   | ✅ Supported       |

| < 1.0   | ❌ Not supported   |



\## Reporting a Vulnerability



We take security seriously. If you discover a security vulnerability in MergeMind, please report it privately.



\*\*Do NOT open a public issue.\*\*



\### Contact



Email: \*\*dineshbista642@gmail.com\*\*



Please include:



\- Description of the vulnerability

\- Steps to reproduce

\- Affected versions

\- Any possible mitigations



\### Response Timeline



| Timeframe | Action |

|-----------|--------|

| Within 48 hours | Acknowledge receipt of your report |

| Within 7 days | Confirm the vulnerability and assess severity |

| Within 30 days | Release a patch and public disclosure |



We will keep you informed of progress throughout the process.



\## Security Practices



\### Authentication



\- GitHub OAuth 2.0 with NextAuth.js

\- JWT session tokens signed with HMAC-SHA256

\- Session tokens verified on every authenticated backend request

\- No hardcoded credentials or demo users

\- X-GitHub-User header not trusted without verified JWT



\### API Security



\- Rate limiting: 100 requests per 60 seconds per IP

\- CORS restricted to production domain

\- Input sanitization on all path and query parameters

\- Pydantic validation on all request bodies

\- Structured JSON error responses (no stack traces in production)



\### Infrastructure



\- HTTPS enforced via Vercel and Railway TLS termination

\- Security headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, HSTS

\- Non-root user in Docker containers

\- Production config validation (refuses to start if misconfigured)

\- All secrets via environment variables (never in source code)



\### API Tokens



\- GitHub personal access tokens with minimal required scopes (`repo`, `user`)

\- Tokens stored as environment variables, never committed

\- `.env` files gitignored



\### Dependencies



\- Regular dependency updates via Dependabot

\- Python dependencies pinned in `requirements.txt`

\- Node.js dependencies with `package-lock.json`



\## Disclosure Policy



\- Vulnerabilities will be disclosed 30 days after a patch is released

\- Credit given to the reporter (unless anonymity requested)

\- CVE requested for critical vulnerabilities



\## Scope



The security policy covers:



\- `https://mergemind-tau.vercel.app` (frontend)

\- `https://mergemind-production-e501.up.railway.app` (backend API)

\- `https://github.com/BistaDinesh03/mergemind` (source code)



Third-party services (GitHub API, Google Gemini AI) have their own security policies.

