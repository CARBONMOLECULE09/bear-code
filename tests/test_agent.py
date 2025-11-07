"""
Tests for the Bear Agent core functionality.
Note: These tests require an OpenAI API key to be set in the environment.
"""

import os
import pytest
from unittest.mock import Mock, patch
from bear_agent.agent import BearAgent
from bear_agent.config import Config


def test_config_validation():
    """Test configuration validation."""
    # Without API key
    with patch.dict(os.environ, {}, clear=True):
        config = Config()
        assert config.validate() is False
    
    # With API key
    with patch.dict(os.environ, {"OPENAI_API_KEY": "test-key"}):
        config = Config()
        assert config.validate() is True
        assert config.get_api_key() == "test-key"


def test_agent_initialization_without_key():
    """Test that agent initialization fails without API key."""
    with patch.dict(os.environ, {}, clear=True):
        with pytest.raises(ValueError, match="OpenAI API key must be provided"):
            BearAgent()


def test_agent_initialization_with_key():
    """Test that agent initializes correctly with API key."""
    with patch.dict(os.environ, {"OPENAI_API_KEY": "test-key"}):
        agent = BearAgent()
        assert agent.api_key == "test-key"
        assert agent.model == "gpt-4"
        assert agent.conversation_history == []


def test_read_file(tmp_path):
    """Test file reading functionality."""
    # Create a temporary file
    test_file = tmp_path / "test.py"
    test_content = "def hello():\n    print('Hello, World!')"
    test_file.write_text(test_content)
    
    with patch.dict(os.environ, {"OPENAI_API_KEY": "test-key"}):
        agent = BearAgent()
        content = agent.read_file(str(test_file))
        assert content == test_content


def test_write_file(tmp_path):
    """Test file writing functionality."""
    test_file = tmp_path / "output.py"
    test_content = "def goodbye():\n    print('Goodbye!')"

    with patch.dict(os.environ, {"OPENAI_API_KEY": "test-key"}):
        agent = BearAgent()
        agent.write_file(str(test_file), test_content)
        assert test_file.read_text() == test_content


def test_read_nonexistent_file():
    """Test reading a file that doesn't exist."""
    with patch.dict(os.environ, {"OPENAI_API_KEY": "test-key"}):
        agent = BearAgent()
        with pytest.raises(IOError, match="Error reading file:"):
            agent.read_file("/nonexistent/file.py")


def test_clear_history():
    """Test clearing conversation history."""
    with patch.dict(os.environ, {"OPENAI_API_KEY": "test-key"}):
        agent = BearAgent()
        agent.conversation_history = [
            {"role": "user", "content": "test"},
            {"role": "assistant", "content": "response"}
        ]
        agent.clear_history()
        assert agent.conversation_history == []


def test_default_model():
    """Test default model configuration."""
    with patch.dict(os.environ, {"OPENAI_API_KEY": "test-key"}):
        agent = BearAgent()
        assert agent.model == "gpt-4"


def test_custom_model():
    """Test custom model configuration."""
    with patch.dict(os.environ, {"OPENAI_API_KEY": "test-key"}):
        agent = BearAgent(model="gpt-3.5-turbo")
        assert agent.model == "gpt-3.5-turbo"


# Note: The following tests would require mocking the OpenAI API
# or using actual API calls, which is beyond the scope of basic testing

def test_analyze_code_mock():
    """Test code analysis with mocked API."""
    with patch.dict(os.environ, {"OPENAI_API_KEY": "test-key"}):
        agent = BearAgent()
        
        # Mock the OpenAI client
        with patch.object(agent.client.chat.completions, 'create') as mock_create:
            mock_response = Mock()
            mock_response.choices = [Mock()]
            mock_response.choices[0].message.content = "This code looks good!"
            mock_create.return_value = mock_response
            
            result = agent.analyze_code("def test(): pass", "review this code")
            assert "This code looks good!" in result
