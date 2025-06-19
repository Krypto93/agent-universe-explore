
# AI Agent Marketplace Backend with AWS Fargate

This is the serverless backend for the AI Agent Marketplace built with AWS SAM, Lambda, DynamoDB, API Gateway, and AWS Fargate for container-based agent execution.

## Architecture

- **AWS Lambda**: Serverless functions for API endpoints
- **Amazon DynamoDB**: NoSQL database for agent metadata and execution tracking
- **Amazon API Gateway**: REST API with CORS support
- **AWS Fargate**: Serverless containers for running AI agents
- **Amazon ECS**: Container orchestration service
- **VPC**: Virtual Private Cloud with public/private subnets
- **AWS SAM**: Infrastructure as Code template

## Prerequisites

1. AWS CLI configured with appropriate permissions
2. AWS SAM CLI installed
3. Node.js 18.x or later
4. Docker (for local testing)

## Setup

### 1. Install AWS SAM CLI
```bash
# macOS
brew install aws-sam-cli

# Windows
choco install aws-sam-cli

# Linux
pip install aws-sam-cli
```

### 2. Configure AWS Credentials
```bash
aws configure
```

### 3. Deploy the Backend
```bash
chmod +x deploy.sh
./deploy.sh
```

The deployment will create:
- VPC with public/private subnets
- ECS Cluster with Fargate capacity
- DynamoDB tables for agents and executions
- Lambda functions for API endpoints
- API Gateway with CORS support

## API Endpoints

### Agent Management
- `GET /agents` - Get all agents (with optional category filter)
- `GET /agents/{id}` - Get specific agent by ID
- `POST /agents` - Create new agent
- `PUT /agents/{id}` - Update existing agent
- `DELETE /agents/{id}` - Delete agent

### Agent Execution (New)
- `POST /agents/{id}/run` - Deploy and run agent in Fargate container
- `GET /executions/{executionId}` - Get execution status and endpoint
- `POST /executions/{executionId}/stop` - Stop running execution

## Database Schema

### Agents Table
- **Primary Key**: `id` (String)
- **Global Secondary Index**: `CategoryIndex` on `category`

### Executions Table (New)
- **Primary Key**: `executionId` (String)
- **Global Secondary Index**: `AgentIdIndex` on `agentId`

### Execution Record Structure
```json
{
  "executionId": "string",
  "agentId": "string",
  "agentName": "string",
  "status": "starting|running|completed|failed|stopped",
  "taskArn": "string",
  "endpoint": "string|null",
  "startTime": "ISO string",
  "endTime": "ISO string|null",
  "input": "object"
}
```

## Agent Execution Flow

1. **Run Agent**: POST `/agents/{id}/run`
   - Creates ECS Fargate task with agent container
   - Stores execution record in DynamoDB
   - Returns execution ID and status

2. **Monitor Execution**: GET `/executions/{executionId}`
   - Returns current status and endpoint (when running)
   - Updates status from ECS task state

3. **Stop Execution**: POST `/executions/{executionId}/stop`
   - Stops ECS task
   - Updates execution status to 'stopped'

## Container Configuration

The ECS task definition uses a basic Node.js container that:
- Runs on port 8080
- Accepts environment variables for agent configuration
- Provides a simple HTTP API for agent interaction
- Logs to CloudWatch

### Environment Variables Passed to Container
- `AGENT_ID`: The agent identifier
- `AGENT_NAME`: The agent name
- `EXECUTION_ID`: Unique execution identifier
- `INPUT_DATA`: JSON string of input parameters

## Networking

- **VPC**: 10.0.0.0/16
- **Public Subnets**: 10.0.1.0/24, 10.0.2.0/24
- **Private Subnets**: 10.0.3.0/24, 10.0.4.0/24
- **NAT Gateway**: For private subnet internet access
- **Security Groups**: Allow HTTP/HTTPS traffic

## Cost Optimization

- **Fargate**: Pay only for running containers
- **DynamoDB**: PAY_PER_REQUEST billing mode
- **Lambda**: 30-60 second timeouts
- **CloudWatch Logs**: 7-day retention

## Monitoring

- **CloudWatch Logs**: ECS task logs and Lambda logs
- **ECS Console**: Task status and health monitoring
- **DynamoDB Console**: Execution tracking

## Security

- **IAM Roles**: Least privilege access for ECS tasks and Lambda
- **VPC**: Private subnets for container execution
- **Security Groups**: Restricted network access

## Development Notes

### Custom Agent Containers
To use custom agent containers:
1. Build your agent Docker image
2. Push to ECR or Docker Hub
3. Update the `AgentTaskDefinition` in template.yaml
4. Redeploy the stack

### Local Testing
```bash
# Test Lambda functions locally
sam local start-api

# Test container locally
docker run -p 8080:8080 -e AGENT_ID=test -e AGENT_NAME="Test Agent" public.ecr.aws/docker/library/node:18-alpine
```

## Troubleshooting

### Common Issues
1. **Task fails to start**: Check ECS task definition and IAM roles
2. **No endpoint returned**: Verify networking configuration
3. **Container exits immediately**: Check container logs in CloudWatch

### Debugging
- Check CloudWatch logs for Lambda functions
- Monitor ECS task status in AWS Console
- Verify DynamoDB records for execution tracking

```
