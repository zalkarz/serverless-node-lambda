## Serverless Framework 

For more details about `Serverless Framework`, please check the official [documentation](https://www.serverless.com/framework/docs/providers/aws).

## Usage

### Pre-Requisites
1. Install serverless framework globally
```
$ npm i -g serverless
```
2. Install aws-cli, follow the [official guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

3. Setup Serverless with [aws-cli](https://www.serverless.com/framework/docs/providers/aws/guide/credentials#setup-with-the-aws-cli)
```
$ serverless config credentials --provider aws --key <ACCESS KEY> --secret <SECRET ACCESS KEY>
```

4. Install all dependencies
```
$ npm install
```

## Structure 

```
.
├── configs (configuration folder)
├── modules (modules folder)
│   └── sns (module / context)
│       ├── endpoints (API endpoints)
│       │   ├── create.js
│       │   ├── delete.js
│       │   ├── read.js
│       │   └── update.js
│       └── functions (workers / background functions)
├── package.json
├── serverless.yml (serverless config)
├── handlers (functions config)
│   ├── sns-endpoints.yml (endpoints config)
├── shared (shared components)
│   └── lib (shared libraries)
│       ├── kinesis.js
│       ├── lambda.js
│       ├── parsers.js
│       ├── sqs.js
│       └── uuid.js
```

## Functions

### HTTP Trigger Function (API Gateway)

```yml
functions:

  # API Endpoints
  sns-types:
    handler: modules/sns/endpoints/read.list #Path to function
    memorySize: 128 # Lambda Memory Limit
    timeout: 30 # Lambda Timeout
    events: 
      - http: # HTTP Trigger 
          path: member/sns
          method: get
          integration: lambda
          # Requires clients to add API keys values in the `x-api-key` header of their request
          # private: true

```

## Development environment 

This boilerplate uses `serverless-local` plugin and some containers and plugins to emulate the AWS Resources

```bash
docker-compose up
```
The applications will start on `http://localhost:3000`

### Dev Plugins

This boilerplate contains following plugins for local development: 

* [serverless-offline](https://github.com/dherault/serverless-offline/issues) - For run API Gateway local and manage plugins

## Production environment

### Deploy full services

```bash
serverless deploy --stage ${dev or prod}
```

### Deploy a function 

```bash
serverless deploy function -f sns-types
```

### Get function logs

```bash
serverless sns-types -f bananinha -t
```

### Clean All

```bash
serverless remove
```

## Testing

**List of SNS kinds**

```bash
curl -X GET \
    ${sns-types lambda endoint}
```

## Custom and Environment Variables

### Custom Items

> Creating and Using custom variables to build dynamic name

```yml
custom:
  secrets: ${file(./configs/${self:provider.stage}.json)}
```

### Environment Variables

> Building URL Resources using CloudFormation parameters and Custom Variables 

```yml
  #Global Environment variables
  environment:
    RDS_DATABASE: ${self:custom.secrets.RDS_DATABASE}
    RDS_HOSTNAME: ${self:custom.secrets.RDS_HOSTNAME}
    RDS_PASSWORD: ${self:custom.secrets.RDS_PASSWORD}
    RDS_USERNAME: ${self:custom.secrets.RDS_USERNAME}
```



## Manage AWS Cloudformation with Serverless

### IAM Roles

[IAM Docs](https://serverless.com/framework/docs/providers/aws/guide/iam/)

```yml
  # Instruct Serverless to use an existing IAM role for all Lambda functions
  iam:
    role: ${self:custom.secrets.EXECUTION_ROLE}
    #deploymentRole: ${self:custom.secrets.DEPLOYMENT_ROLE}
```

### Manage Infrastructure Components - [Docs](https://serverless.com/framework/docs/providers/aws/guide/resources/#aws-cloudformation-resource-reference)

```yml
# Infrastrucure - Cloud Formation
resources:  # CloudFormation template syntax
```

### VPC
Configure the Lambda functions to run inside a VPC
[VPC docs](https://www.serverless.com/framework/docs/providers/aws/guide/functions#vpc-configuration)
```yml
  # If you use VPC then both securityGroupIds and subnetIds are required
  vpc:
    securityGroupIds:
      - ${self:custom.secrets.SECURITY_GROUP_ID}
    subnetIds:
      - ${self:custom.secrets.SUBNET1_ID}
      - ${self:custom.secrets.SUBNET2_ID}
```
