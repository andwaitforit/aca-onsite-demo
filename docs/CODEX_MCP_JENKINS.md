# Using OpenAI Codex CLI with mabl MCP in Jenkins

## Overview

Yes, the OpenAI Codex CLI can potentially be used within a Jenkins pipeline connected to the mabl MCP server. This creates an AI-powered testing automation workflow where Codex can intelligently interact with mabl's testing capabilities.

## Architecture

```
Jenkins Pipeline
    ↓
Codex CLI (AI Orchestrator)
    ↓
mabl MCP Server (via stdio)
    ↓
mabl Platform (Testing Services)
```

## Components Required

### 1. OpenAI Codex CLI
- **Package**: `@openai/codex-cli` or `codex-cli`
- **Purpose**: Acts as an MCP client that can communicate with mabl MCP server
- **Authentication**: Requires `OPENAI_API_KEY` environment variable

### 2. mabl MCP Server
- **Package**: `@mablhq/mabl-cli` (via npx)
- **Command**: `npx @mablhq/mabl-cli@latest mcp start`
- **Protocol**: stdio (standard input/output)
- **Authentication**: Requires mabl API key

### 3. Codex Configuration

Create `~/.codex/config.toml`:

```toml
[mcp_servers.mabl]
command = "npx"
args = ["@mablhq/mabl-cli@latest", "mcp", "start"]
env = { MABL_API_KEY = "your_mabl_api_key" }

[codex]
model = "gpt-4"
temperature = 0.7
```

## Use Cases

### 1. Natural Language Test Commands
Instead of writing specific CLI commands, you can use natural language:

```bash
codex exec "Run the login test suite in staging environment" --mcp-server mabl
```

### 2. Intelligent Test Selection
Codex can analyze code changes and select relevant tests:

```bash
codex chat "Based on the recent changes to LoginPage.js, which mabl tests should we run?" --mcp-server mabl
```

### 3. Test Result Analysis
Codex can interpret test results and provide insights:

```bash
codex analyze "Explain why the authentication tests failed" --mcp-server mabl
```

### 4. Dynamic Test Creation
Codex can create new tests based on requirements:

```bash
codex exec "Create a mabl test for the new transfer feature" --mcp-server mabl
```

## Jenkins Pipeline Example

See `Jenkinsfile.codex-mcp` for a complete example.

### Key Pipeline Stages:

1. **Setup**: Install Codex CLI and mabl CLI
2. **Configure**: Set up Codex config with mabl MCP server
3. **Verify**: Test MCP connection
4. **Build**: Build your application
5. **Test**: Use Codex to run tests via mabl MCP
6. **Analyze**: Use Codex to analyze results

## Setup Instructions

### 1. Install Codex CLI

```bash
npm install -g @openai/codex-cli
# or
npm install -g codex-cli
```

### 2. Configure Jenkins Credentials

Add these credentials in Jenkins:
- `openai-api-key`: Your OpenAI API key
- `mabl-api-key`: Your mabl API key

### 3. Add Codex Config Step

The pipeline will automatically create the Codex config file, or you can pre-configure it:

```bash
mkdir -p ~/.codex
cat > ~/.codex/config.toml << 'EOF'
[mcp_servers.mabl]
command = "npx"
args = ["@mablhq/mabl-cli@latest", "mcp", "start"]
EOF
```

### 4. Run Pipeline

The Jenkinsfile handles:
- Authentication
- MCP server startup
- Codex command execution
- Result collection

## Command Examples

### Basic Test Execution
```bash
# Traditional way
npx @mablhq/mabl-cli@latest deployments create --application-id APP_ID --environment-id ENV_ID

# Codex way (natural language)
codex exec "Run all tests in staging" --mcp-server mabl
```

### Test Analysis
```bash
# Get results and analyze
TEST_RESULTS=$(npx @mablhq/mabl-cli@latest test-runs list --format json)
echo "$TEST_RESULTS" | codex analyze "What tests are failing and why?"
```

### Dynamic Test Selection
```bash
codex chat "Which mabl tests should I run after these code changes? [paste git diff]" --mcp-server mabl
```

## Benefits

1. **Natural Language Interface**: Use plain English instead of CLI syntax
2. **Intelligent Automation**: Codex can make decisions about which tests to run
3. **Result Interpretation**: AI-powered analysis of test failures
4. **Adaptive Testing**: Codex can create or modify tests based on code changes
5. **Reduced Script Maintenance**: Less brittle than hardcoded CLI commands

## Important Note

⚠️ **Codex CLI Availability**: The OpenAI Codex CLI may not be publicly available as described. The concept is valid, but:
- OpenAI's CLI tools and their MCP support may vary
- The exact package name (`@openai/codex-cli`, `codex-cli`, etc.) needs verification
- OpenAI may provide different tools (like `openai` CLI) that don't directly support MCP
- **Alternative**: Use OpenAI's API directly with an MCP client library

## Limitations & Considerations

1. **Codex CLI Availability**: Verify the exact package name and availability
   - May not be publicly available
   - Check OpenAI documentation for current CLI tools
   - Consider using OpenAI API directly with MCP SDK instead

2. **MCP Protocol Support**: Ensure the tool actually supports MCP
   - MCP is relatively new, CLI support may vary
   - May need to use MCP SDK directly instead

3. **Cost Considerations**: 
   - Each Codex command consumes OpenAI API credits
   - Consider caching and batching commands

4. **Error Handling**:
   - Codex interpretations may need validation
   - Always verify AI-generated test commands

5. **Security**:
   - Store API keys securely in Jenkins credentials
   - Limit Codex's access to necessary mabl operations

## Alternative: Direct MCP SDK Usage

If Codex CLI doesn't support MCP directly, you can use MCP SDK:

```python
from mcp import ClientSession, StdioServerParameters
import subprocess

async def run_mabl_test():
    server_params = StdioServerParameters(
        command="npx",
        args=["@mablhq/mabl-cli@latest", "mcp", "start"]
    )
    
    async with ClientSession(server_params) as session:
        result = await session.call_tool(
            "mcp_mabl_run_mabl_test_cloud",
            {
                "testId": "test-id",
                "applicationId": "app-id",
                "environmentId": "env-id",
                "browsers": ["chrome"]
            }
        )
        return result
```

## Troubleshooting

### "Codex CLI not found"
```bash
# Try different package names
npm install -g @openai/codex-cli
npm install -g codex-cli
npm install -g codex
```

### "MCP server connection failed"
- Verify mabl CLI is installed: `npx @mablhq/mabl-cli@latest --version`
- Check authentication: `npx @mablhq/mabl-cli@latest auth status`
- Test MCP manually: `npx @mablhq/mabl-cli@latest mcp start`

### "Codex doesn't support MCP"
- Use MCP SDK directly (Python, Node.js, Go)
- Create wrapper scripts that translate Codex commands to MCP calls
- Use Codex for high-level orchestration, direct CLI for execution

## Future Enhancements

1. **Custom MCP Tools**: Create domain-specific MCP tools for your testing needs
2. **Multi-Server MCP**: Connect Codex to multiple MCP servers (mabl, Jira, etc.)
3. **Intelligent Retry Logic**: Codex can decide when to retry failed tests
4. **Test Generation**: Automatically generate tests from user stories

## References

- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [mabl CLI Documentation](https://help.mabl.com/docs/mabl-cli)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)

