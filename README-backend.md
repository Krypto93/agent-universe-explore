
# AI Agent Marketplace Backend

This is the serverless backend for the AI Agent Marketplace built with AWS SAM, Lambda, DynamoDB, and API Gateway.

## Architecture

- **AWS Lambda**: Serverless functions for API endpoints
- **Amazon DynamoDB**: NoSQL database for agent metadata
- **Amazon API Gateway**: REST API with CORS support
- **AWS SAM**: Infrastructure as Code template

## Prerequisites

1. AWS CLI configured with appropriate permissions
2. AWS SAM CLI installed
3. Node.js 18.x or later

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

## API Endpoints

- `GET /agents` - Get all agents (with optional category filter)
- `GET /agents/{id}` - Get specific agent by ID
- `POST /agents` - Create new agent
- `PUT /agents/{id}` - Update existing agent
- `DELETE /agents/{id}` - Delete agent
- `POST /agents/{id}/run` - Run agent (placeholder for container execution)

## Database Schema

### Agents Table
- **Primary Key**: `id` (String)
- **Global Secondary Index**: `CategoryIndex` on `category`

### Agent Record Structure
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "category": "string",
  "price": "number",
  "rating": "number",
  "users": "number",
  "runtime": "string",
  "author": "string",
  "tags": ["string"],
  "features": ["string"],
  "documentation": "string",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

## Populate Database

After deployment, populate the database with sample data:

```bash
# Get the table name from CloudFormation outputs
aws cloudformation describe-stacks --stack-name <your-stack-name> --query 'Stacks[0].Outputs'

# Install dependencies for the populate script
cd scripts && npm install aws-sdk uuid

# Run the populate script
node populate-db.js <your-table-name>
```

## Local Development

To test locally:

```bash
# Start local API
sam local start-api

# Test endpoints
curl http://localhost:3000/agents
```

## Environment Variables

The Lambda functions use these environment variables:
- `AGENTS_TABLE`: DynamoDB table name (set automatically by SAM)
- `CORS_ORIGIN`: CORS origin setting (default: "*")

## Security Notes

- CORS is currently set to allow all origins ("*") for development
- Consider implementing authentication/authorization for production
- API Gateway request validation should be added
- Consider implementing rate limiting

## Monitoring

- CloudWatch logs are automatically created for each Lambda function
- Consider adding X-Ray tracing for better observability
- Set up CloudWatch alarms for error rates and latency

## Cost Optimization

- DynamoDB is configured with PAY_PER_REQUEST billing
- Lambda functions have a 30-second timeout (60s for run agent)
- Consider reserved capacity for DynamoDB if usage is predictable
