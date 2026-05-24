# Knapsack Optimizer

This project contains a straightforward implementation of the classic
0/1 knapsack problem using dynamic programming.  Given a list of item
values and weights along with a maximum weight capacity, the algorithm
computes the maximum total value that can be carried and identifies which
items should be selected to achieve that value.

The knapsack problem appears frequently in resource allocation and
optimisation scenarios, including the optimisation tool described in my
resume for the Easy SRI (Smart Readiness Interface).  Although the real
project integrates this algorithm into a larger energy efficiency domain,
this example illustrates the core technique in isolation.

## Running the Script

You only need Python 3 to run this example—no external packages are
required.  From the `knapsack_optimizer` directory, run:

```bash
python knapsack_optimizer.py
```

By default the script defines three items and a maximum capacity of 50.
It prints the maximum achievable value and the indices of the selected
items.  You can modify the `values`, `weights` and `capacity` variables
within the script to try other scenarios.

## File Overview

- `knapsack_optimizer.py` – Contains a simple dynamic programming function to
  solve the 0/1 knapsack problem and a small demonstration in the
  `__main__` block.