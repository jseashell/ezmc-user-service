import { create, deleteFunc, find, findAll, update } from '@functions/index';
import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'ezmc-user-service',
  frameworkVersion: '3',
  plugins: ['serverless-bundle', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'us-east-1',
    stage: '${sls:stage, "main"}',
    stackTags: {
      Stage: '${self:provider.stage}',
      Region: '${self:provider.region}',
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['rds-db:connect'],
            Resource: ['arn:aws:rds:${self:provider.region}:${aws:accountId}:db:ezmc-user-main'],
          },
        ],
      },
    },
    logs: {
      frameworkLambda: true,
      restApi: {
        accessLogging: true,
        executionLogging: true,
      },
    },
  },
  // import the function via paths
  functions: { create, deleteFunc, findAll, find, update },
  package: {
    individually: true,
    patterns: [
      'prisma/schema.prisma',
      // Reduce the footprint of Prisma binaries deployments
      '!node_modules/.prisma/client/libquery_engine-*',
      'node_modules/.prisma/client/libquery_engine-rhel-*',
      '!node_modules/prisma/libquery_engine-*',
      '!node_modules/@prisma/engines/**',
    ],
  },
  resources: {
    Resources: {
      RdsDatabase: {
        Type: 'AWS::RDS::DBInstance',
        Properties: {
          AllocatedStorage: '5',
          DBInstanceClass: 'db.t3.micro',
          DBInstanceIdentifier: '${self:service}-${self:provider.stage}',
          DeletionProtection: false,
          Engine: 'postgres',
          EngineVersion: '13.7',
          ManageMasterUserPassword: true,
          Port: '5432',
          VPCSecurityGroups: ['${env:AWS_DEFAULT_SECURITY_GROUP}'],
        },
      },
      RdsSecret: {
        Type: 'AWS::SecretsManager::Secret',
        Properties: {
          GenerateSecretString: {
            SecretStringTemplate: '{"username": "postgres"}',
            GenerateStringKey: 'password',
            PasswordLength: 16,
            ExcludeCharacters: '"@/\\',
          },
        },
      },
    },
    Outputs: {
      RdsSecretId: {
        Value: '!Ref RdsSecret',
      },
    },
  },
};

module.exports = serverlessConfiguration;
