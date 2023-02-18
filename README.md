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
export DB_URL="postgresql://${DB_USERNAME}:${DB_PASSWORD}@localhost:5432/${DB_NAME}"
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
