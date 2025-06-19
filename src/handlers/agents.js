
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const ecs = new AWS.ECS();
const agentsTable = process.env.AGENTS_TABLE;
const executionsTable = process.env.EXECUTIONS_TABLE;
const ecsCluster = process.env.ECS_CLUSTER;
const taskDefinition = process.env.ECS_TASK_DEFINITION;
const subnet1 = process.env.ECS_SUBNET_1;
const subnet2 = process.env.ECS_SUBNET_2;
const securityGroup = process.env.ECS_SECURITY_GROUP;

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
      TableName: agentsTable
    };

    if (category && category !== 'All') {
      params = {
        TableName: agentsTable,
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
      TableName: agentsTable,
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
      TableName: agentsTable,
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
      TableName: agentsTable,
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
      TableName: agentsTable,
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

// Run agent in Fargate container
exports.runAgent = async (event) => {
  try {
    const { id } = event.pathParameters;
    const requestBody = event.body ? JSON.parse(event.body) : {};

    console.log('Running agent:', id);

    // Get agent details first
    const getParams = {
      TableName: agentsTable,
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
    const executionId = uuidv4();

    console.log('Starting Fargate task for agent:', agent.name);

    // Create ECS task with environment variables
    const taskParams = {
      cluster: ecsCluster,
      taskDefinition: taskDefinition,
      launchType: 'FARGATE',
      networkConfiguration: {
        awsvpcConfiguration: {
          subnets: [subnet1, subnet2],
          securityGroups: [securityGroup],
          assignPublicIp: 'ENABLED'
        }
      },
      overrides: {
        containerOverrides: [
          {
            name: 'agent-container',
            environment: [
              {
                name: 'AGENT_ID',
                value: id
              },
              {
                name: 'AGENT_NAME',
                value: agent.name
              },
              {
                name: 'EXECUTION_ID',
                value: executionId
              },
              {
                name: 'INPUT_DATA',
                value: JSON.stringify(requestBody.input || {})
              }
            ]
          }
        ]
      }
    };

    const taskResult = await ecs.runTask(taskParams).promise();

    if (taskResult.failures && taskResult.failures.length > 0) {
      console.error('ECS task failures:', taskResult.failures);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to start agent container',
          details: taskResult.failures
        })
      };
    }

    const task = taskResult.tasks[0];
    const taskArn = task.taskArn;

    console.log('Task started with ARN:', taskArn);

    // Store execution details in DynamoDB
    const executionRecord = {
      executionId: executionId,
      agentId: id,
      agentName: agent.name,
      status: 'starting',
      taskArn: taskArn,
      startTime: new Date().toISOString(),
      input: requestBody.input || {},
      endpoint: null // Will be updated once container is running
    };

    const putParams = {
      TableName: executionsTable,
      Item: executionRecord
    };

    await dynamoDb.put(putParams).promise();

    // Wait a moment and check task status
    setTimeout(async () => {
      try {
        await updateExecutionStatus(executionId, taskArn);
      } catch (error) {
        console.error('Error updating execution status:', error);
      }
    }, 5000);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        executionId: executionId,
        agentId: id,
        agentName: agent.name,
        status: 'starting',
        taskArn: taskArn,
        startTime: executionRecord.startTime,
        message: `Agent ${agent.name} is starting in container`
      })
    };
  } catch (error) {
    console.error('Error running agent:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to run agent',
        details: error.message
      })
    };
  }
};

// Get execution status
exports.getExecutions = async (event) => {
  try {
    const { executionId } = event.pathParameters;

    const params = {
      TableName: executionsTable,
      Key: { executionId }
    };

    const result = await dynamoDb.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Execution not found' })
      };
    }

    // Update status from ECS if task is still running
    if (result.Item.taskArn && (result.Item.status === 'starting' || result.Item.status === 'running')) {
      await updateExecutionStatus(executionId, result.Item.taskArn);
      
      // Get updated record
      const updatedResult = await dynamoDb.get(params).promise();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(updatedResult.Item)
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Item)
    };
  } catch (error) {
    console.error('Error getting execution:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to get execution' })
    };
  }
};

// Stop execution
exports.stopExecution = async (event) => {
  try {
    const { executionId } = event.pathParameters;

    // Get execution record
    const getParams = {
      TableName: executionsTable,
      Key: { executionId }
    };

    const result = await dynamoDb.get(getParams).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Execution not found' })
      };
    }

    const execution = result.Item;

    // Stop ECS task if it's running
    if (execution.taskArn && (execution.status === 'starting' || execution.status === 'running')) {
      const stopParams = {
        cluster: ecsCluster,
        task: execution.taskArn,
        reason: 'Stopped by user request'
      };

      await ecs.stopTask(stopParams).promise();
    }

    // Update execution status
    const updateParams = {
      TableName: executionsTable,
      Key: { executionId },
      UpdateExpression: 'SET #status = :status, endTime = :endTime',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': 'stopped',
        ':endTime': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };

    const updateResult = await dynamoDb.update(updateParams).promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(updateResult.Attributes)
    };
  } catch (error) {
    console.error('Error stopping execution:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to stop execution' })
    };
  }
};

// Helper function to update execution status
async function updateExecutionStatus(executionId, taskArn) {
  try {
    const describeParams = {
      cluster: ecsCluster,
      tasks: [taskArn]
    };

    const taskDescription = await ecs.describeTasks(describeParams).promise();
    const task = taskDescription.tasks[0];

    if (!task) {
      return;
    }

    let status = 'unknown';
    let endpoint = null;

    switch (task.lastStatus) {
      case 'PENDING':
        status = 'starting';
        break;
      case 'RUNNING':
        status = 'running';
        // Extract endpoint from task (simplified - in real scenario you'd use ALB or service discovery)
        if (task.attachments &&task.attachments.length > 0) {
          const networkInterface = task.attachments[0].details.find(detail => detail.name === 'networkInterfaceId');
          if (networkInterface) {
            // In a real implementation, you would resolve the ENI to get the public IP
            endpoint = `http://task-${taskArn.split('/').pop()}.example.com:8080`;
          }
        }
        break;
      case 'STOPPED':
        status = task.stopCode === 'EssentialContainerExited' ? 'completed' : 'failed';
        break;
      default:
        status = 'unknown';
    }

    const updateParams = {
      TableName: executionsTable,
      Key: { executionId },
      UpdateExpression: 'SET #status = :status' + (endpoint ? ', endpoint = :endpoint' : '') + (status === 'completed' || status === 'failed' ? ', endTime = :endTime' : ''),
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': status,
        ...(endpoint && { ':endpoint': endpoint }),
        ...((status === 'completed' || status === 'failed') && { ':endTime': new Date().toISOString() })
      }
    };

    await dynamoDb.update(updateParams).promise();
    console.log(`Updated execution ${executionId} status to ${status}`);
  } catch (error) {
    console.error('Error updating execution status:', error);
  }
}
