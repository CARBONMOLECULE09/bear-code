# Quick Start Guide for Bear Code 🐻

## Prerequisites
- Python 3.8 or higher
- OpenAI API key

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CARBONMOLECULE09/bear-code.git
   cd bear-code
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure your API key**
   
   Create a `.env` file:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```
   
   Or set it as an environment variable:
   ```bash
   export OPENAI_API_KEY='sk-your-actual-api-key-here'
   ```

## Usage Examples

### 1. Analyze Code
```bash
python -m bear_agent analyze examples/sample.py
```

With a specific task:
```bash
python -m bear_agent analyze examples/sample.py --task "find bugs and suggest improvements"
```

### 2. Generate Code
```bash
python -m bear_agent generate "create a function to sort a list of dictionaries by a specific key"
```

Save to a file:
```bash
python -m bear_agent generate "create a REST API using Flask" --output app.py
```

### 3. Modify Existing Code
```bash
python -m bear_agent modify examples/sample.py "add type hints to all functions"
```

Save to a different file:
```bash
python -m bear_agent modify examples/sample.py "optimize the fibonacci function" --output optimized.py
```

### 4. Interactive Chat
```bash
python -m bear_agent chat
```

Then ask questions like:
- "How can I improve this algorithm?"
- "Explain the difference between lists and tuples in Python"
- "Write a decorator for timing function execution"

Type `exit` or `quit` to end the chat session.

## Running Tests

Install development dependencies:
```bash
pip install -r requirements-dev.txt
```

Run tests:
```bash
PYTHONPATH=src pytest tests/ -v
```

## Tips

- Use `--model gpt-3.5-turbo` for faster, cheaper responses
- The chat mode maintains conversation history during the session
- All commands support the `--help` flag for more options

## Troubleshooting

**Issue: "OpenAI API key must be provided"**
- Make sure your `.env` file is in the root directory
- Or set the `OPENAI_API_KEY` environment variable

**Issue: Module not found errors**
- Run `pip install -r requirements.txt` again
- Make sure you're using `PYTHONPATH=src python -m bear_agent` or install with `pip install -e .`

## Next Steps

- Read the full [README.md](README.md) for more details
- Check out the [examples](examples/) directory
- Contribute to the project on GitHub!

---

Happy coding with Bear! 🐻
