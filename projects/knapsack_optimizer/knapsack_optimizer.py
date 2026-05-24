"""
knapsack_optimizer.py
=====================

This module implements a basic dynamic programming solution to the
0/1 knapsack problem.  The knapsack problem asks: given a set of items,
each with a value and a weight, and a weight capacity, which items
should you include in your knapsack to maximise the total value without
exceeding the capacity?

The `knapsack` function returns both the maximum attainable value and
the list of item indices that achieve this value.  A small example
demonstration is provided in the `__main__` block.
"""

from __future__ import annotations

from typing import List, Tuple


def knapsack(values: List[int], weights: List[int], capacity: int) -> Tuple[int, List[int]]:
    """Solve the 0/1 knapsack problem using dynamic programming.

    Args:
        values: A list of integer values for each item.
        weights: A list of weights for each item.  Must be the same length as `values`.
        capacity: The maximum weight capacity of the knapsack.

    Returns:
        A tuple `(max_value, selected_indices)` where `max_value` is the maximum
        total value attainable and `selected_indices` is a list of item indices
        (0‑based) that should be included to achieve this value.
    """
    n = len(values)
    # Initialize DP table: (n+1) x (capacity+1) with zeros
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    # Build table dp[][] in bottom up manner
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            if weights[i - 1] <= w:
                # Max of including the item vs excluding it
                dp[i][w] = max(dp[i - 1][w], dp[i - 1][w - weights[i - 1]] + values[i - 1])
            else:
                dp[i][w] = dp[i - 1][w]

    # Trace back to find which items were included
    w = capacity
    selected_indices: List[int] = []
    for i in range(n, 0, -1):
        if dp[i][w] != dp[i - 1][w]:
            selected_indices.append(i - 1)
            w -= weights[i - 1]
    selected_indices.reverse()

    return dp[n][capacity], selected_indices


def main() -> None:
    # Example usage
    values = [60, 100, 120]
    weights = [10, 20, 30]
    capacity = 50
    max_val, items = knapsack(values, weights, capacity)
    print(f"Maximum value that can be carried: {max_val}")
    print(f"Selected item indices (0‑based): {items}")


if __name__ == "__main__":
    main()