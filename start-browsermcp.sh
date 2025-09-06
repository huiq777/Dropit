#!/bin/bash
# Start BrowserMCP Server for Claude Code

echo "🚀 Starting BrowserMCP Server..."
echo "📍 Location: /Users/hui/Desktop/projects/Dropit/browsermcp"
echo "🔑 API Key: sk-97d5b53492b654f0785a3328e8673c82"
echo "🌐 Server URL: http://localhost:8931/mcp"
echo ""

cd /Users/hui/Desktop/projects/Dropit/browsermcp

export ANCHOR_API_KEY="sk-97d5b53492b654f0785a3328e8673c82"

echo "⏳ Starting server on port 8931..."
node cli.js --port 8931 --host localhost