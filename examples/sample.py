"""
Sample Python code for testing Bear Code AI Agent.
This module demonstrates various Python features.
"""


def fibonacci(n):
    """Calculate fibonacci number (inefficient recursive version)."""
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)


def factorial(n):
    """Calculate factorial of n."""
    if n == 0 or n == 1:
        return 1
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result


class Calculator:
    """Simple calculator class."""
    
    def add(self, a, b):
        return a + b
    
    def subtract(self, a, b):
        return a - b
    
    def multiply(self, a, b):
        return a * b
    
    def divide(self, a, b):
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b


if __name__ == "__main__":
    print(f"Fibonacci(10): {fibonacci(10)}")
    print(f"Factorial(5): {factorial(5)}")
    
    calc = Calculator()
    print(f"10 + 5 = {calc.add(10, 5)}")
    print(f"10 - 5 = {calc.subtract(10, 5)}")
