
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.AGENTS_TABLE;

// CORS headers
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

// Get all agents
exports.getAgents = async (event) => {
  try {
    const { category } = event.queryStringParameters || {};
    
    let params = {
      TableName: tableName
    };

    if (category && category !== 'All') {
      params = {
        TableName: tableName,
        IndexName: 'CategoryIndex',
        KeyConditionExpression: 'category = :category',
        ExpressionAttributeValues: {
          ':category': category
        }
      };
    }

    const result = category && category !== 'All' 
      ? await dynamoDb.query(params).promise()
      : await dynamoDb.scan(params).promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        agents: result.Items || [],
        count: result.Count || 0
      })
    };
  } catch (error) {
    console.error('Error getting agents:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to get agents' })
    };
  }
};

// Get agent by ID
exports.getAgentById = async (event) => {
  try {
    const { id } = event.pathParameters;

    const params = {
      TableName: tableName,
      Key: { id }
    };

    const result = await dynamoDb.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Agent not found' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Item)
    };
  } catch (error) {
    console.error('Error getting agent:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to get agent' })
    };
  }
};

// Create new agent
exports.createAgent = async (event) => {
  try {
    const agentData = JSON.parse(event.body);
    
    const agent = {
      id: uuidv4(),
      ...agentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const params = {
      TableName: tableName,
      Item: agent
    };

    await dynamoDb.put(params).promise();

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(agent)
    };
  } catch (error) {
    console.error('Error creating agent:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to create agent' })
    };
  }
};

// Update agent
exports.updateAgent = async (event) => {
  try {
    const { id } = event.pathParameters;
    const updates = JSON.parse(event.body);

    // Remove id from updates to prevent overwriting
    delete updates.id;
    delete updates.createdAt;
    
    // Add updatedAt timestamp
    updates.updatedAt = new Date().toISOString();

    const updateExpression = 'SET ' + Object.keys(updates).map(key => `#${key} = :${key}`).join(', ');
    const expressionAttributeNames = Object.keys(updates).reduce((acc, key) => {
      acc[`#${key}`] = key;
      return acc;
    }, {});
    const expressionAttributeValues = Object.keys(updates).reduce((acc, key) => {
      acc[`:${key}`] = updates[key];
      return acc;
    }, {});

    const params = {
      TableName: tableName,
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamoDb.update(params).promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Attributes)
    };
  } catch (error) {
    console.error('Error updating agent:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to update agent' })
    };
  }
};

// Delete agent
exports.deleteAgent = async (event) => {
  try {
    const { id } = event.pathParameters;

    const params = {
      TableName: tableName,
      Key: { id }
    };

    await dynamoDb.delete(params).promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Agent deleted successfully' })
    };
  } catch (error) {
    console.error('Error deleting agent:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to delete agent' })
    };
  }
};

// Run agent (placeholder for container execution)
exports.runAgent = async (event) => {
  try {
    const { id } = event.pathParameters;
    const requestBody = event.body ? JSON.parse(event.body) : {};

    // Get agent details first
    const getParams = {
      TableName: tableName,
      Key: { id }
    };

    const agentResult = await dynamoDb.get(getParams).promise();

    if (!agentResult.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Agent not found' })
      };
    }

    const agent = agentResult.Item;

    // Placeholder for container execution logic
    // This is where you would integrate with AWS ECS, Fargate, or other container services
    const executionResult = {
      executionId: uuidv4(),
      agentId: id,
      agentName: agent.name,
      status: 'running',
      startTime: new Date().toISOString(),
      input: requestBody.input || {},
      message: `Agent ${agent.name} execution started successfully`
    };

    // In a real implementation, you would:
    // 1. Start a container with the agent code
    // 2. Pass the input parameters
    // 3. Monitor execution status
    // 4. Return real-time status updates

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(executionResult)
    };
  } catch (error) {
    console.error('Error running agent:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to run agent' })
    };
  }
};
