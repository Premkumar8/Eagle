"""
emotion_recognition.py
======================

This script defines and trains a one‑dimensional convolutional neural
network (1‑D CNN) to classify electrocardiogram (ECG) signals into several
emotional categories.  In lieu of an actual ECG dataset, it creates a
synthetic dataset of random signals.  The goal is to illustrate the
structure of a PyTorch model and a basic training loop.

When adapting this example to real data you should replace the
`generate_synthetic_dataset` function with code that loads and preprocesses
your ECG recordings, and adjust the network architecture and loss function
as needed.
"""

import torch
import torch.nn as nn
import torch.optim as optim


def generate_synthetic_dataset(
    num_samples: int = 1000, seq_len: int = 128, num_classes: int = 5
) -> tuple[torch.Tensor, torch.Tensor]:
    """Create a synthetic dataset of random signals and labels.

    Args:
        num_samples: Number of samples to generate.
        seq_len: Length of each one‑dimensional signal.
        num_classes: Number of target classes.

    Returns:
        A tuple `(X, y)` where `X` is of shape `(num_samples, 1, seq_len)`
        containing float32 signals and `y` is of shape `(num_samples,)`
        containing integer class labels.
    """
    X = torch.randn(num_samples, 1, seq_len)
    y = torch.randint(0, num_classes, (num_samples,))
    return X, y


class SimpleECGCNN(nn.Module):
    """A simple 1‑D CNN for classifying ECG signals."""

    def __init__(self, num_classes: int = 5) -> None:
        super().__init__()
        # Convolution layer increases channel dimension from 1 to 16
        self.conv1 = nn.Conv1d(in_channels=1, out_channels=16, kernel_size=5, padding=2)
        self.relu = nn.ReLU()
        # Global average pooling reduces sequence length to 1
        self.pool = nn.AdaptiveAvgPool1d(1)
        # Fully connected layer maps features to class logits
        self.fc = nn.Linear(16, num_classes)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.conv1(x)
        x = self.relu(x)
        x = self.pool(x)
        # Flatten the channel dimension
        x = x.squeeze(-1)
        x = self.fc(x)
        return x


def train_model(
    model: nn.Module,
    data_loader: torch.utils.data.DataLoader,
    criterion: nn.Module,
    optimizer: optim.Optimizer,
    epochs: int = 10,
) -> None:
    """Train the neural network for a specified number of epochs."""
    model.train()
    for epoch in range(epochs):
        running_loss = 0.0
        for signals, labels in data_loader:
            optimizer.zero_grad()
            outputs = model(signals)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item() * signals.size(0)
        epoch_loss = running_loss / len(data_loader.dataset)
        print(f"Epoch {epoch+1:02d}/{epochs} - Loss: {epoch_loss:.4f}")


def main() -> None:
    # Hyperparameters
    num_samples = 1000
    seq_len = 128
    num_classes = 5
    batch_size = 32
    epochs = 10
    learning_rate = 1e-3

    # Generate synthetic data
    X, y = generate_synthetic_dataset(num_samples, seq_len, num_classes)
    dataset = torch.utils.data.TensorDataset(X, y)
    data_loader = torch.utils.data.DataLoader(dataset, batch_size=batch_size, shuffle=True)

    # Instantiate model, loss and optimizer
    model = SimpleECGCNN(num_classes=num_classes)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)

    # Train the model
    train_model(model, data_loader, criterion, optimizer, epochs=epochs)

    print("Training completed.")


if __name__ == "__main__":
    main()