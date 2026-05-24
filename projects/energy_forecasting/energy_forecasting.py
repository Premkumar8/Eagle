"""
energy_forecasting.py
=====================

This script creates and trains a simple recurrent neural network to forecast
energy consumption data.  Rather than relying on a real energy dataset, it
generates a synthetic time series from a sine function with added Gaussian
noise.  The series is converted to a supervised learning task by pairing
windows of past values with the next value.  An LSTM model built with Keras
(TensorFlow backend) is then trained and evaluated.

The code is intentionally minimalist so that the core concepts of time‑series
preprocessing and sequence modelling are easy to follow.  You can extend
`generate_data` to load real data, adjust the look‑back window, or experiment
with deeper architectures and longer training schedules.
"""

import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense


def generate_data(seq_len: int = 400, noise_std: float = 0.1) -> np.ndarray:
    """Generate a synthetic sine wave with added Gaussian noise.

    Args:
        seq_len: Number of points to generate.
        noise_std: Standard deviation of the Gaussian noise.

    Returns:
        A one‑dimensional numpy array containing the synthetic time series.
    """
    t = np.linspace(0, 4 * np.pi, seq_len)
    signal = np.sin(t)
    noise = np.random.normal(0, noise_std, size=seq_len)
    return signal + noise


def create_dataset(data: np.ndarray, look_back: int = 10) -> tuple[np.ndarray, np.ndarray]:
    """Transform a 1‑D time series into a supervised learning dataset.

    Each sample consists of `look_back` consecutive points from the input
    series, and the target is the value immediately following this window.

    Args:
        data: One‑dimensional array containing the time series.
        look_back: Number of past steps to use as input.

    Returns:
        A tuple `(X, y)` where `X` has shape `(samples, look_back)` and
        `y` has shape `(samples,)`.
    """
    X, y = [], []
    for i in range(len(data) - look_back):
        X.append(data[i : i + look_back])
        y.append(data[i + look_back])
    return np.array(X), np.array(y)


def main() -> None:
    # Generate synthetic data
    series = generate_data(seq_len=500)

    # Prepare supervised learning dataset
    look_back = 20
    X, y = create_dataset(series, look_back)
    # Reshape X to have the shape (samples, timesteps, features)
    X = X.reshape((X.shape[0], look_back, 1))

    # Scale the inputs and targets between 0 and 1
    scaler_x = MinMaxScaler(feature_range=(0, 1))
    scaler_y = MinMaxScaler(feature_range=(0, 1))
    X_reshaped = X.reshape(-1, 1)
    X_scaled = scaler_x.fit_transform(X_reshaped).reshape(X.shape)
    y_scaled = scaler_y.fit_transform(y.reshape(-1, 1)).flatten()

    # Split into training and testing sets
    split_idx = int(0.8 * len(X_scaled))
    X_train, X_test = X_scaled[:split_idx], X_scaled[split_idx:]
    y_train, y_test = y_scaled[:split_idx], y_scaled[split_idx:]

    # Build the LSTM model
    model = Sequential(
        [
            LSTM(50, input_shape=(look_back, 1), activation="tanh"),
            Dense(1),
        ]
    )
    model.compile(optimizer="adam", loss="mse")
    model.summary()

    # Train the model
    model.fit(
        X_train,
        y_train,
        epochs=20,
        batch_size=16,
        validation_split=0.1,
        verbose=2,
    )

    # Evaluate on the test set
    test_loss = model.evaluate(X_test, y_test, verbose=0)
    print(f"Test mean squared error: {test_loss:.6f}")


if __name__ == "__main__":
    main()