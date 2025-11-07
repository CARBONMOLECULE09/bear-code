"""
Core AI Agent module for code analysis and generation.
"""

import os
from typing import Optional, List, Dict
from openai import OpenAI


class BearAgent:
    """AI Coding Agent that can analyze and generate code."""

    def __init__(self, api_key: Optional[str] = None, model: str = "gpt-4"):
        """
        Initialize the Bear Agent.

        Args:
            api_key: OpenAI API key (if not provided, will use OPENAI_API_KEY env var)
            model: The model to use for generation
        """
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OpenAI API key must be provided or set in OPENAI_API_KEY environment variable")

        self.model = model
        self.client = OpenAI(api_key=self.api_key)
        self.conversation_history: List[Dict[str, str]] = []

    def read_file(self, filepath: str) -> str:
        """
        Read contents of a file.

        Args:
            filepath: Path to the file to read

        Returns:
            File contents as string
        """
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                return f.read()
        except Exception as e:
            return f"Error reading file: {str(e)}"

    def write_file(self, filepath: str, content: str) -> bool:
        """
        Write content to a file.

        Args:
            filepath: Path to the file to write
            content: Content to write

        Returns:
            True if successful, False otherwise
        """
        try:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)
            return True
        except Exception as e:
            print(f"Error writing file: {str(e)}")
            return False

    def analyze_code(self, code: str, task: str = "analyze this code") -> str:
        """
        Analyze code using AI.

        Args:
            code: The code to analyze
            task: Specific task or question about the code

        Returns:
            AI analysis response
        """
        prompt = f"{task}\n\n```\n{code}\n```"
        return self.chat(prompt)

    def generate_code(self, description: str, language: str = "python") -> str:
        """
        Generate code based on description.

        Args:
            description: Description of what code to generate
            language: Programming language

        Returns:
            Generated code
        """
        prompt = (
            f"Generate {language} code for the following:\n{description}\n\nProvide only the code without explanations."
        )
        return self.chat(prompt)

    def modify_code(self, code: str, instruction: str) -> str:
        """
        Modify existing code based on instruction.

        Args:
            code: The original code
            instruction: What modification to make

        Returns:
            Modified code
        """
        prompt = (
            f"Modify the following code according to this instruction: {instruction}\n\n"
            f"```\n{code}\n```\n\nProvide only the modified code."
        )
        return self.chat(prompt)

    def chat(self, message: str, system_prompt: Optional[str] = None) -> str:
        """
        Have a conversation with the AI agent.

        Args:
            message: User message
            system_prompt: Optional system prompt to set context

        Returns:
            AI response
        """
        messages = []

        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        elif not self.conversation_history:
            messages.append(
                {
                    "role": "system",
                    "content": (
                        "You are Bear Code, an expert AI coding agent that helps with "
                        "code analysis, generation, and modification. Be concise and practical."
                    ),
                }
            )

        # Add conversation history
        messages.extend(self.conversation_history)

        # Add new message
        messages.append({"role": "user", "content": message})

        try:
            response = self.client.chat.completions.create(model=self.model, messages=messages)

            assistant_message = response.choices[0].message.content

            # Update conversation history
            self.conversation_history.append({"role": "user", "content": message})
            self.conversation_history.append({"role": "assistant", "content": assistant_message})

            return assistant_message
        except Exception as e:
            return f"Error communicating with AI: {str(e)}"

    def clear_history(self):
        """Clear conversation history."""
        self.conversation_history = []

    def analyze_file(self, filepath: str, task: str = "analyze this code") -> str:
        """
        Analyze a code file.

        Args:
            filepath: Path to the file
            task: What to do with the file

        Returns:
            Analysis result
        """
        content = self.read_file(filepath)
        if content.startswith("Error"):
            return content
        return self.analyze_code(content, task)
