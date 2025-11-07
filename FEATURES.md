# Bear Code Features 🐻

## Command Overview

Bear Code provides four powerful commands to help you with coding tasks:

### 1. 🔍 analyze - Code Analysis
Analyze any code file and get AI-powered insights.

**Usage:**
```bash
python -m bear_agent analyze <filepath> [--task <description>] [--model <model>]
```

**Examples:**
```bash
# Basic analysis
python -m bear_agent analyze examples/sample.py

# Find specific issues
python -m bear_agent analyze app.py --task "find security vulnerabilities"

# Code review
python -m bear_agent analyze server.js --task "review code quality"

# Performance analysis
python -m bear_agent analyze algorithm.py --task "suggest performance optimizations"
```

### 2. ✨ generate - Code Generation
Create new code from natural language descriptions.

**Usage:**
```bash
python -m bear_agent generate "<description>" [--language <lang>] [--output <file>]
```

**Examples:**
```bash
# Generate a function
python -m bear_agent generate "a function to validate email addresses"

# Generate in specific language
python -m bear_agent generate "a REST API endpoint for user login" --language javascript

# Save to file
python -m bear_agent generate "a binary search tree class" --output bst.py

# Complex generation
python -m bear_agent generate "a decorator that logs function execution time" --output decorator.py
```

### 3. 🔧 modify - Code Modification
Modify existing code based on instructions.

**Usage:**
```bash
python -m bear_agent modify <filepath> "<instruction>" [--output <file>]
```

**Examples:**
```bash
# Add features
python -m bear_agent modify utils.py "add error handling to all functions"

# Refactor
python -m bear_agent modify legacy.py "refactor using modern Python best practices"

# Add documentation
python -m bear_agent modify module.py "add comprehensive docstrings"

# Optimize
python -m bear_agent modify slow_code.py "optimize for better performance" --output optimized.py
```

### 4. 💬 chat - Interactive Assistant
Chat with the AI about your code and programming questions.

**Usage:**
```bash
python -m bear_agent chat [--model <model>]
```

**Example Conversation:**
```
You: Explain the difference between deep copy and shallow copy
Bear: [AI provides detailed explanation]

You: Show me an example in Python
Bear: [AI provides code example]

You: How can I optimize a recursive function?
Bear: [AI provides optimization strategies]
```

Type `exit` or `quit` to end the session.

## Model Options

All commands support model selection:

```bash
# Use GPT-4 (default, most capable)
python -m bear_agent analyze code.py --model gpt-4

# Use GPT-3.5 Turbo (faster, cheaper)
python -m bear_agent analyze code.py --model gpt-3.5-turbo
```

## Language Support

Bear Code works with any programming language:
- Python
- JavaScript/TypeScript
- Java
- C/C++
- Go
- Rust
- Ruby
- PHP
- And many more!

## Use Cases

### 🐛 Bug Finding
```bash
python -m bear_agent analyze buggy_code.py --task "find all potential bugs"
```

### 📚 Learning
```bash
python -m bear_agent chat
> "Explain list comprehensions in Python with examples"
```

### 🏗️ Scaffolding
```bash
python -m bear_agent generate "a Flask REST API with CRUD operations" --output api.py
```

### ♻️ Refactoring
```bash
python -m bear_agent modify old_code.py "refactor to use async/await"
```

### 📝 Documentation
```bash
python -m bear_agent modify undocumented.py "add complete documentation"
```

### 🎯 Code Review
```bash
python -m bear_agent analyze pull_request.py --task "code review with suggestions"
```

### 🚀 Optimization
```bash
python -m bear_agent analyze slow.py --task "identify performance bottlenecks"
```

## Tips & Tricks

### 💡 Be Specific
The more specific your instructions, the better the results:
```bash
# Good
python -m bear_agent modify app.py "add input validation for user email and password"

# Less specific
python -m bear_agent modify app.py "make it better"
```

### 🔄 Iterative Refinement
Use chat mode for iterative development:
```bash
python -m bear_agent chat
> "Write a function to parse JSON"
> "Now add error handling"
> "Add logging"
> "Optimize for large files"
```

### 📋 Combine Commands
```bash
# Generate, then analyze, then modify
python -m bear_agent generate "sorting algorithm" --output sort.py
python -m bear_agent analyze sort.py --task "check correctness"
python -m bear_agent modify sort.py "add time complexity comments"
```

### 🎨 Rich Output
All output uses Rich formatting for beautiful terminal display:
- Syntax highlighting
- Tables and panels
- Markdown rendering
- Color coding

## Environment Variables

Configure Bear Code behavior:

```bash
# Required
export OPENAI_API_KEY='your-api-key'

# Optional
export BEAR_MODEL='gpt-4'              # Default model
export BEAR_MAX_TOKENS='2000'          # Max response tokens
```

Or use a `.env` file:
```
OPENAI_API_KEY=sk-...
BEAR_MODEL=gpt-4
BEAR_MAX_TOKENS=2000
```

## Advanced Usage

### Analyze Multiple Files
```bash
for file in src/*.py; do
    python -m bear_agent analyze "$file" --task "security audit"
done
```

### Batch Generation
```bash
python -m bear_agent generate "utility function for file handling" --output utils/files.py
python -m bear_agent generate "logging configuration" --output config/logging.py
python -m bear_agent generate "database models" --output models/db.py
```

### Pipeline Processing
```bash
# Generate, modify, and verify
python -m bear_agent generate "web scraper" --output scraper.py && \
python -m bear_agent modify scraper.py "add rate limiting" && \
python -m bear_agent analyze scraper.py --task "verify correctness"
```

## Getting Help

Every command has built-in help:
```bash
python -m bear_agent --help
python -m bear_agent analyze --help
python -m bear_agent generate --help
python -m bear_agent modify --help
python -m bear_agent chat --help
```

---

Ready to start? Check out [QUICKSTART.md](QUICKSTART.md) for installation instructions!
