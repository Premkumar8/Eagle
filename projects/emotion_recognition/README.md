# Emotion Recognition from ECG (Synthetic)

This project shows how to build a simple one‑dimensional convolutional
neural network (1‑D CNN) in PyTorch to classify electrocardiogram (ECG)
signals into multiple emotional categories.  In a production setting you
might train on real ECG data collected from physiological sensors.  For the
sake of this demonstration, however, the script creates synthetic signals
consisting of random noise.  The focus is on the model architecture and
training loop rather than the quality of the data.

## Prerequisites

You need Python 3.7 or later and the `torch` package.  To install PyTorch
with CPU support run:

```bash
pip install torch
```

Alternatively you can install all dependencies for the repository using
`pip install -r ../requirements.txt`.

## How to Run

From the `emotion_recognition` directory run the script:

```bash
python emotion_recognition.py
```

The script will generate a small synthetic dataset, train a CNN for a few
epochs and print the training loss after each epoch.  You can adjust the
`num_samples`, `seq_len` or `num_classes` variables in the script to
experiment with different dataset sizes and classification targets.

## File Overview

- `emotion_recognition.py` – Contains the full PyTorch implementation of
  a simple 1‑D CNN, data generation, training loop and loss reporting.