# HomeWorkTeacherExperience
Created with CodeSandbox

## LTI 1.3.

The backend is configured to act as an LTI 1.3 tool using the [`ltijs`](https://github.com/Cvmcosta/ltijs) provider.  Set the
following environment variables for your LMS platform:

- `LTI_ENCRYPTION_KEY`
- `LTI_DATABASE_URL`
- `LTI_PLATFORM_URL`
- `LTI_CLIENT_ID`
- `LTI_AUTH_LOGIN_URL`
- `LTI_AUTH_TOKEN_URL`
- `LTI_KEYSET_URL`
- `LTI_DEPLOYMENT_ID`

The tool exposes login initiation and launch endpoints under `/lti/login` and `/lti/launch`.  Grade/passback and Names & Role
services are available at `/lti/grade` and `/lti/names` respectively.

## Docker

Build the front-end and back-end images and start both services:

```bash
docker compose up --build
```

The back-end expects the following environment variables:
- `AZURE_SQL_CONNECTION_STRING`
- `COSMOS_DB_ENDPOINT`
- `COSMOS_DB_KEY`

## Azure deployment

Terraform scripts under `infrastructure/` provision an Azure resource group,
container registry, and App Services for the front-end and back-end. Set the
required variables and run:

```bash
cd infrastructure
./deploy.sh -auto-approve
```
