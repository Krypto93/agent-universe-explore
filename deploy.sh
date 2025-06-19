
#!/bin/bash

# Deploy script for AI Agent Marketplace Backend
set -e

echo "Building and deploying AI Agent Marketplace Backend..."

# Check if AWS SAM CLI is installed
if ! command -v sam &> /dev/null; then
    echo "AWS SAM CLI is not installed. Please install it first:"
    echo "https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html"
    exit 1
fi

# Install dependencies
echo "Installing backend dependencies..."
cd src && npm install && cd ..

# Build the SAM application
echo "Building SAM application..."
sam build

# Deploy the application
echo "Deploying to AWS..."
sam deploy --guided

echo "Deployment completed!"
echo "Check the AWS CloudFormation console for stack outputs including API Gateway URL."
