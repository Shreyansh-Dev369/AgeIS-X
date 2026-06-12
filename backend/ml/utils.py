import pandas as pd
import os
import numpy as np
from sklearn.utils.class_weight import compute_class_weight

# ---------------------------
# LOAD DATA
# ---------------------------
def load_dataset(file_path: str):
    """
    Loads a CSV dataset and ensures labels are integer type.
    """
    df = pd.read_csv(file_path)
    df['label'] = df['label'].astype(int)
    return df

# ---------------------------
# SHUFFLE DATA
# ---------------------------
def shuffle_data(df, random_state=42):
    return df.sample(frac=1, random_state=random_state).reset_index(drop=True)

# ---------------------------
# SPLIT DATA
# ---------------------------
def train_test_split_df(df, test_size=0.2, random_state=42):
    from sklearn.model_selection import train_test_split
    X_train, X_test, y_train, y_test = train_test_split(
        df['url'].astype(str),
        df['label'],
        test_size=test_size,
        stratify=df['label'],
        random_state=random_state
    )
    return X_train, X_test, y_train, y_test

# ---------------------------
# COMPUTE CLASS WEIGHTS
# ---------------------------
def get_class_weights(y_train):
    classes = np.unique(y_train)
    weights = compute_class_weight(class_weight='balanced', classes=classes, y=y_train)
    return dict(zip(classes, weights))

# ---------------------------
# SAVE MODEL OR VECTOR
# ---------------------------
def save_pickle(obj, path):
    import pickle
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        pickle.dump(obj, f)

# ---------------------------
# LOAD MODEL OR VECTOR
# ---------------------------
def load_pickle(path):
    import pickle
    with open(path, "rb") as f:
        return pickle.load(f)