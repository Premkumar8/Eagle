# Energy Forecasting

This project demonstrates how to build and train a simple long short‑term
memory (LSTM) neural network to forecast energy consumption.  The goal is to
show the basic workflow of preparing time‑series data, converting it into a
supervised learning problem, training an LSTM using the Keras API in
TensorFlow, and evaluating the model’s performance.

Because this repository doesn’t include any proprietary or external energy
datasets, the script generates a synthetic time series based on a sine wave
with added noise.  Even though the data are artificial, the modelling
technique is the same as you would use for real consumption data.

## Prerequisites

To run this project you need Python 3.7 or later and the following Python
packages:

* `numpy`
* `pandas`
* `tensorflow` (which includes Keras)
* `scikit‑learn`
* `matplotlib` (only required if you choose to visualise the data)

You can install these packages individually with `pip` or use the
repository‑wide `requirements.txt` file:

```bash
pip install -r ../requirements.txt
```

## How to Run

Execute the training script from within this directory:

```bash
python energy_forecasting.py
```

The script will generate a synthetic time series, split it into training and
testing sets, build an LSTM model, train it for a small number of epochs and
print the mean squared error on the test set.

Feel free to modify the `generate_data` function or the model architecture to
experiment with different patterns or more complex models.

## File Overview

- `energy_forecasting.py` – Contains the full Python code to generate data,
  prepare input/output sequences, build and train the LSTM model, and report
  the test loss.