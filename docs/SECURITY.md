# Security Policy

## Reporting Vulnerabilities
Please report any security concerns directly to the repository maintainer.

## Security Controls
- **Input Sanitization**: Node coordinates and layout names are sanitized against XSS and injection.
- **CORS Protection**: Express server restricts CORS origins to authorized frontend domains.
- **Environment Isolation**: Database credentials and port numbers are read exclusively from environment variables.
