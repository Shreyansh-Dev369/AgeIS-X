import pandas as pd
import os
import pickle
import warnings
import numpy as np
warnings.filterwarnings("ignore")

from sklearn.feature_extraction.text import HashingVectorizer
from sklearn.linear_model import SGDClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.utils import shuffle
from sklearn.utils.class_weight import compute_class_weight

# ---------------------------
# SETTINGS
# ---------------------------
RANDOM_STATE = 42
BATCH_SIZE = 50000  # memory-friendly batch size
TEST_SIZE = 0.2

# ---------------------------
# PATHS
# ---------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "processed", "final_dataset.csv")
MODEL_PATH = os.path.join(BASE_DIR, "model")
os.makedirs(MODEL_PATH, exist_ok=True)

# ---------------------------
# LOAD DATA
# ---------------------------
df = pd.read_csv(DATA_PATH)
df['label'] = df['label'].astype(int)
df = shuffle(df, random_state=RANDOM_STATE)

# Split train/test
X_train_full, X_test, y_train_full, y_test = train_test_split(
    df['url'].astype(str),
    df['label'],
    test_size=TEST_SIZE,
    stratify=df['label'],
    random_state=RANDOM_STATE
)

print(f"📦 Train size: {len(X_train_full)}, Test size: {len(X_test)}")

# ---------------------------
# COMPUTE CLASS WEIGHTS
# ---------------------------
classes = np.array([0, 1])
class_weights = compute_class_weight(
    class_weight='balanced',
    classes=classes,
    y=y_train_full
)
weight_dict = {0: class_weights[0], 1: class_weights[1]}
print("⚖️ Class weights:", weight_dict)

# ---------------------------
# HASHING VECTOR
# ---------------------------
vectorizer = HashingVectorizer(
    n_features=2**20,  # 1 million features → memory safe
    analyzer='char',
    ngram_range=(2, 5),
    alternate_sign=False
)

# ---------------------------
# MODEL (SGDClassifier)
# ---------------------------
model = SGDClassifier(
    loss='log_loss',  # logistic regression
    max_iter=5,
    random_state=RANDOM_STATE
    # ❌ NO class_weight here for partial_fit
)

# ---------------------------
# TRAIN IN BATCHES
# ---------------------------
for start in range(0, len(X_train_full), BATCH_SIZE):
    end = start + BATCH_SIZE
    X_batch = vectorizer.transform(X_train_full[start:end])
    y_batch = y_train_full[start:end]

    # Apply class weights manually per batch
    sample_weights = np.array([weight_dict[label] for label in y_batch])

    model.partial_fit(X_batch, y_batch, classes=classes, sample_weight=sample_weights)
    print(f"✅ Trained batch {start} → {min(end, len(X_train_full))}")

# ---------------------------
# EVALUATION
# ---------------------------
X_test_vect = vectorizer.transform(X_test)
y_pred = model.predict(X_test_vect)

acc = accuracy_score(y_test, y_pred)
print(f"\n📊 Test Accuracy: {acc:.4f}")
print("\n📄 Classification Report:\n")
print(classification_report(y_test, y_pred))

# ---------------------------
# SAVE MODEL & VECTORIZER
# ---------------------------
with open(os.path.join(MODEL_PATH, "model.pkl"), "wb") as f:
    pickle.dump(model, f)

with open(os.path.join(MODEL_PATH, "vectorizer.pkl"), "wb") as f:
    pickle.dump(vectorizer, f)

print("\n✅ Model & vectorizer saved successfully!")claude