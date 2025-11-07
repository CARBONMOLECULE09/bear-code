"""
Command-line interface for Bear Code AI Agent.
"""

import sys
import click
from rich.console import Console
from rich.markdown import Markdown
from rich.panel import Panel
from dotenv import load_dotenv

from bear_agent.agent import BearAgent


# Load environment variables
load_dotenv()

console = Console()


@click.group()
@click.version_option(version="0.1.0")
def cli():
    """
    🐻 Bear Code - AI Coding Agent

    An intelligent coding assistant that can analyze, generate, and modify code.
    """
    pass


@cli.command()
@click.argument("filepath", type=click.Path(exists=True))
@click.option("--task", "-t", default="analyze this code", help="Specific analysis task")
@click.option("--model", "-m", default="gpt-4", help="AI model to use")
def analyze(filepath, task, model):
    """Analyze a code file."""
    try:
        console.print(f"[bold blue]🐻 Bear Code - Analyzing {filepath}[/bold blue]\n")

        agent = BearAgent(model=model)
        result = agent.analyze_file(filepath, task)

        console.print(Panel(Markdown(result), title="Analysis Result", border_style="green"))
    except Exception as e:
        console.print(f"[bold red]Error: {str(e)}[/bold red]")
        sys.exit(1)


@cli.command()
@click.argument("description")
@click.option("--language", "-l", default="python", help="Programming language")
@click.option("--output", "-o", type=click.Path(), help="Output file path")
@click.option("--model", "-m", default="gpt-4", help="AI model to use")
def generate(description, language, output, model):
    """Generate code from a description."""
    try:
        console.print(f"[bold blue]🐻 Bear Code - Generating {language} code[/bold blue]\n")

        agent = BearAgent(model=model)
        code = agent.generate_code(description, language)

        if output:
            agent.write_file(output, code)
            console.print(f"[bold green]✓ Code written to {output}[/bold green]")
        else:
            console.print(Panel(code, title="Generated Code", border_style="green"))
    except Exception as e:
        console.print(f"[bold red]Error: {str(e)}[/bold red]")
        sys.exit(1)


@cli.command()
@click.argument("filepath", type=click.Path(exists=True))
@click.argument("instruction")
@click.option("--output", "-o", type=click.Path(), help="Output file path (default: overwrites input)")
@click.option("--model", "-m", default="gpt-4", help="AI model to use")
def modify(filepath, instruction, output, model):
    """Modify code in a file based on instructions."""
    try:
        console.print(f"[bold blue]🐻 Bear Code - Modifying {filepath}[/bold blue]\n")

        agent = BearAgent(model=model)
        original_code = agent.read_file(filepath)

        if original_code.startswith("Error"):
            console.print(f"[bold red]{original_code}[/bold red]")
            sys.exit(1)

        modified_code = agent.modify_code(original_code, instruction)

        output_path = output or filepath
        agent.write_file(output_path, modified_code)

        console.print(f"[bold green]✓ Modified code written to {output_path}[/bold green]")
    except Exception as e:
        console.print(f"[bold red]Error: {str(e)}[/bold red]")
        sys.exit(1)


@cli.command()
@click.option("--model", "-m", default="gpt-4", help="AI model to use")
def chat(model):
    """Start an interactive chat session with the AI agent."""
    try:
        console.print("[bold blue]🐻 Bear Code - Interactive Chat[/bold blue]")
        console.print("Type 'exit' or 'quit' to end the session\n")

        agent = BearAgent(model=model)

        while True:
            try:
                user_input = console.input("[bold cyan]You:[/bold cyan] ")

                if user_input.lower() in ["exit", "quit"]:
                    console.print("[bold yellow]Goodbye! 🐻[/bold yellow]")
                    break

                if not user_input.strip():
                    continue

                response = agent.chat(user_input)
                console.print("\n[bold green]Bear:[/bold green]")
                console.print(Markdown(response))
                console.print()

            except KeyboardInterrupt:
                console.print("\n[bold yellow]Goodbye! 🐻[/bold yellow]")
                break

    except Exception as e:
        console.print(f"[bold red]Error: {str(e)}[/bold red]")
        sys.exit(1)


if __name__ == "__main__":
    cli()
