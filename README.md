# Bear Code - AI Coding Agent 🐻

An intelligent AI-powered coding assistant that can analyze, generate, and modify code using advanced language models.

## Features

- **Code Analysis**: Analyze code files and get insights, suggestions, and explanations
- **Code Generation**: Generate code from natural language descriptions
- **Code Modification**: Modify existing code based on instructions
- **Interactive Chat**: Chat with the AI agent about your code and programming questions
- **Multiple Language Support**: Works with various programming languages
- **CLI Interface**: Easy-to-use command-line interface with rich formatting

## Installation

1. Clone the repository:
```bash
git clone https://github.com/CARBONMOLECULE09/bear-code.git
cd bear-code
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up your OpenAI API key:
```bash
export OPENAI_API_KEY='your-api-key-here'
```

Or create a `.env` file:
```
OPENAI_API_KEY=your-api-key-here
```

## Usage

### Analyze Code

Analyze a code file:
```bash
python -m bear_agent analyze path/to/file.py
```

With a specific task:
```bash
python -m bear_agent analyze path/to/file.py --task "find potential bugs"
```

### Generate Code

Generate code from a description:
```bash
python -m bear_agent generate "a function to calculate fibonacci numbers"
```

Generate code in a specific language:
```bash
python -m bear_agent generate "a REST API endpoint" --language javascript
```

Save to a file:
```bash
python -m bear_agent generate "a binary search tree class" --output tree.py
```

### Modify Code

Modify existing code:
```bash
python -m bear_agent modify path/to/file.py "add error handling"
```

Save to a different file:
```bash
python -m bear_agent modify input.py "optimize for performance" --output optimized.py
```

### Interactive Chat

Start an interactive session:
```bash
python -m bear_agent chat
```

## Configuration

You can configure Bear Code using environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `BEAR_MODEL`: The AI model to use (default: `gpt-4`)
- `BEAR_MAX_TOKENS`: Maximum tokens for responses (default: `2000`)

## Examples

### Example 1: Analyze a Python file
```bash
python -m bear_agent analyze examples/sample.py --task "explain what this code does"
```

### Example 2: Generate a utility function
```bash
python -m bear_agent generate "a function to validate email addresses" --output utils.py
```

### Example 3: Add documentation
```bash
python -m bear_agent modify mycode.py "add docstrings to all functions"
```

## Requirements

- Python 3.8+
- OpenAI API key
- Internet connection

## Dependencies

- `openai`: For AI model interaction
- `click`: For CLI interface
- `rich`: For beautiful terminal output
- `python-dotenv`: For environment variable management

## Architecture

Bear Code consists of several modules:

- `agent.py`: Core AI agent with code analysis and generation capabilities
- `cli.py`: Command-line interface implementation
- `config.py`: Configuration management
- `__main__.py`: Entry point for the application

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for any purpose.

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

Made with 🐻 and AI
