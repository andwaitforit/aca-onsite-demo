# Alternative: Using AI with mabl MCP in Jenkins (Practical Approach)

Since OpenAI Codex CLI may not be publicly available, here are practical alternatives for using AI with mabl MCP in Jenkins:

## Option 1: OpenAI API + MCP SDK (Recommended)

Use OpenAI's API directly with an MCP client to create AI-powered test automation:

```python
# scripts/ai-mabl-orchestrator.py
import openai
from mcp import ClientSession, StdioServerParameters
import asyncio
import json

async def ai_mabl_command(prompt: str, mabl_args: dict = None):
    """Use AI to interpret natural language and execute mabl MCP commands"""
    
    # Initialize OpenAI
    client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    
    # Get AI interpretation of the command
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a test automation assistant. Translate user requests into mabl MCP tool calls."},
            {"role": "user", "content": prompt}
        ],
        tools=[{
            "type": "function",
            "function": {
                "name": "mcp_mabl_run_mabl_test_cloud",
                "description": "Run a mabl test in the cloud",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "testId": {"type": "string"},
                        "applicationId": {"type": "string"},
                        "environmentId": {"type": "string"},
                        "browsers": {"type": "array", "items": {"type": "string"}}
                    }
                }
            }
        }]
    )
    
    # Connect to mabl MCP and execute
    server_params = StdioServerParameters(
        command="npx",
        args=["@mablhq/mabl-cli@latest", "mcp", "start"]
    )
    
    async with ClientSession(server_params) as session:
        # Execute the AI-determined MCP command
        tool_call = response.choices[0].message.tool_calls[0]
        result = await session.call_tool(
            tool_call.function.name,
            json.loads(tool_call.function.arguments)
        )
        return result
```

## Option 2: Claude + MCP (Anthropic)

Claude has better native MCP support:

```bash
# Claude CLI with MCP
export ANTHROPIC_API_KEY="your-key"
claude --mcp-server mabl "Run all login tests in staging"
```

## Option 3: Custom AI Wrapper Script

Create a simple wrapper that uses OpenAI API to translate commands:

```bash
#!/bin/bash
# scripts/ai-mabl.sh

PROMPT="$1"
OPENAI_API_KEY="${OPENAI_API_KEY}"

# Use OpenAI to translate natural language to mabl CLI command
COMMAND=$(curl -s https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"gpt-4\",
    \"messages\": [{\"role\": \"user\", \"content\": \"Translate to mabl CLI: $PROMPT\"}]
  }" | jq -r '.choices[0].message.content')

# Execute the command
eval "$COMMAND"
```

## Option 4: Jenkins with AI Plugin

Use Jenkins AI plugins that can execute shell commands:

1. Install a Jenkins AI assistant plugin
2. Configure it to use mabl CLI commands
3. Use natural language in pipeline steps

## Practical Jenkinsfile Example

```groovy
pipeline {
    agent any
    environment {
        OPENAI_API_KEY = credentials('openai-api-key')
        MABL_API_KEY = credentials('mabl-api-key')
    }
    stages {
        stage('AI Test Selection') {
            steps {
                script {
                    // Use Python script with OpenAI + MCP
                    sh '''
                        python3 scripts/ai-mabl-orchestrator.py \
                            "Based on the git diff, which mabl tests should we run?"
                    '''
                }
            }
        }
        stage('Run Selected Tests') {
            steps {
                script {
                    // Execute tests determined by AI
                    sh '''
                        python3 scripts/ai-mabl-orchestrator.py \
                            "Run the selected tests in staging environment"
                    '''
                }
            }
        }
    }
}
```

## Benefits of This Approach

1. **Works Now**: Uses publicly available OpenAI API
2. **Flexible**: Can adapt to different AI models
3. **Reliable**: Direct API access is more stable than CLI tools
4. **Customizable**: Full control over prompts and logic

## Recommendation

**Use Option 1 (OpenAI API + MCP SDK)** because:
- OpenAI API is publicly available and well-documented
- MCP SDK provides direct access to mabl MCP server
- More control over error handling and retries
- Easier to debug and maintain




