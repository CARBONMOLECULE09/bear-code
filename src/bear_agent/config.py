"""
Configuration management for Bear Code.
"""

import os
from typing import Optional


class Config:
    """Configuration manager for Bear Agent."""

    def __init__(self):
        self.openai_api_key: Optional[str] = os.getenv("OPENAI_API_KEY")
        self.default_model: str = os.getenv("BEAR_MODEL", "gpt-4")
        self.max_tokens: int = int(os.getenv("BEAR_MAX_TOKENS", "2000"))

    def validate(self) -> bool:
        """
        Validate configuration.

        Returns:
            True if configuration is valid
        """
        if not self.openai_api_key:
            return False
        return True

    def get_api_key(self) -> Optional[str]:
        """Get the OpenAI API key."""
        return self.openai_api_key
