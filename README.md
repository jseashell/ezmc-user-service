# EZMC User Service

User management service for the EZ Minecraft stack via RESTful API. Data is persisted with a PostgreSQL database hosted in AWS RDS.

## Install

```sh
git clone https://github.com/jseashell/ezmc-user-service.git
cd ezmc-user-service
npm install
```

> Requires Node.js v18+. If using [nvm](https://nvm.sh), run `nvm use` to setup Node.js.

## Running the App

First, setup your environment with the PostgreSQL database URL.

```sh
export DB_HOST="localhost:5432"
export DB_NAME="databaseName"
export DB_USERNAME="postgres"
export DB_PASSWORD="password"
export DB_URL="postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}"
```

Next, generate the Prisma database client

```sh
npx prisma generate
```

Emulate the AWS environment offline locally and request the API

```sh
npm run offline
...
Listening on port 3000
```

Create your first user

```sh
curl localhost:3000/main/create \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{"username": "test", "email": "test@example.com"}'
```

## Database

This service uses [Prisma](https://prisma.io), a Typescript ORM.

Prisma uses a [schema](../../prisma/schema.prisma) to generate a Node package for client connection and query execution. The PrismaClient is setup in the `postinstall` npm script, so you won't typically notice any different workflow from your typical `npm install`. However, maintaining your local database over time as the schema changes will require that you manually trigger migrations in your local development environment.

Due to the nature of Prisma's schema migration and AWS VPCs, running migrations from CI/CD requires a rather complex pipeline that integrates database secrets, environment variables, and identity access management resources. However, migrations can be triggered for local and remote databases manually.

### Local

To sequentially execute all [migrations](./prisma/migrations) on an existing local database.

1. Ensure your `$DB_URL` is configured for your localhost Postgres database
1. Run `npx prisma migrate dev`.

## Remote

1. Modify the AWS RDS instance to be public.
1. Add your dev workstation IP address to the security group ingress rules for the database.
1. Ensure your `$DB_URL` is configured for your remote Postgres database.
1. Run `npx prisma migrate deploy`.

## API

|Endpoint|Method|Description|Request|Response|
|--------|------|-----------|-------|--------|
|`/create`|`POST`|Creates a user|<pre>{<br/>  "username": "test",<br/>  "email: "test@example.com"<br/>}</pre>|<pre>{<br/>  "message": "Success",<br/>  "data": ...<br/>}</pre>|
|`/find`|`POST`|Creates a user|<pre>{<br/>  "username": "test",<br/>  "email: "test@example.com"<br/>}</pre>|<pre>{<br/>  "message": "Success",<br/>  "data": ...<br/>}</pre>* Only one of `username` _or_ `email` is required. |

## Deployment

This microservice is deployed using [Serverless Framework](https://www.serverless.com/framework/docs), which leverages a [Cloudformation template](https://aws.amazon.com/cloudformation/resources/templates/) to provision cloud resources for supporting this REST API.

```sh
npx serverless deploy --stage $STAGE --region $REGION --verbose
```

> `$STAGE` and `$REGION` are optional. The deployment will be staged as `main` to the `us-east-1` region.

Deployment is executed by [Github Actions](https://docs.github.com/en/actions). See [github-actions.yml](./.github/workflows/github-actions.yml) for configuration.

## Project structure

The project code base is mainly located within the `src` folder.

```text
.
├── .github                # CI/CD config
├── .husky                 # Git hooks
├── prisma                 # Prisma ORM client config
├── src
│   ├── functions          # Lambda functions
│   └── libs               # Shared code
├── .eslintrc.js           # Lint config
├── .gitignore
├── .nvmrc                 # NVM config
├── .prettierignore        # Code style ignore patterns
├── .prettierrc.yml        # Code style config
├── LICENSE
├── package-lock.json
├── package.json
├── README.md
├── serverless.ts          # Serverless config
├── tsconfig.json          # Typescript config
└── tsconfig.paths.json    # Typescript import path shortcuts
```

## License

This project is distributed under the terms of the [MIT License](./LICENSE).
