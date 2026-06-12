import pandas as pd
import os

# ---------------------------
# PATH SETUP (robust)
# ---------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "raw")

# Load all CSV files
files = [f for f in os.listdir(DATA_PATH) if f.endswith(".csv")]

dfs = []

# ---------------------------
# LABEL NORMALIZATION
# ---------------------------
def convert_label(x):
    x = str(x).strip().lower()

    if x in ['1', 'phishing', 'bad', 'malicious']:
        return 1
    elif x in ['0', 'benign', 'good', 'legitimate']:
        return 0
    else:
        return None


# ---------------------------
# CLEAN EACH DATAFRAME
# ---------------------------
def clean_df(df, filename):
    df.columns = [col.lower() for col in df.columns]

    # -----------------------
    # FIND URL COLUMN
    # -----------------------
    if 'url' not in df.columns:
        found = False
        for col in df.columns:
            if 'url' in col:
                df.rename(columns={col: 'url'}, inplace=True)
                found = True
                break
        if not found:
            print(f"⚠️ Skipping {filename} (no URL column)")
            return None

    # -----------------------
    # FIND LABEL COLUMN
    # -----------------------
    label_col = None

    for col in ['label', 'type', 'status', 'result', 'class']:
        if col in df.columns:
            label_col = col
            break

    if label_col is None:
        print(f"⚠️ Skipping {filename} (no label column)")
        return None

    # -----------------------
    # NORMALIZE LABELS
    # -----------------------
    df['label'] = df[label_col].apply(convert_label)

    # Remove rows where label couldn't be determined
    df = df.dropna(subset=['label'])

    # Keep only required columns
    df = df[['url', 'label']]

    return df


# ---------------------------
# PROCESS ALL FILES
# ---------------------------
for file in files:
    try:
        file_path = os.path.join(DATA_PATH, file)
        df = pd.read_csv(file_path)

        cleaned = clean_df(df, file)

        if cleaned is not None and not cleaned.empty:
            dfs.append(cleaned)
            print(f"✅ Loaded: {file} ({len(cleaned)} rows)")
        else:
            print(f"⚠️ Skipped empty: {file}")

    except Exception as e:
        print(f"❌ Error in {file}: {e}")


# ---------------------------
# COMBINE DATASETS
# ---------------------------
if len(dfs) == 0:
    raise Exception("❌ No valid datasets found!")

df = pd.concat(dfs, ignore_index=True)

# ---------------------------
# CLEANING
# ---------------------------
df.dropna(inplace=True)
df.drop_duplicates(inplace=True)

# Remove very short URLs
df = df[df['url'].str.len() > 5]

print("\n📊 Before balancing:")
print(df['label'].value_counts())


# ---------------------------
# BALANCING
# ---------------------------
counts = df['label'].value_counts()

if len(counts) < 2:
    raise Exception("❌ Dataset is not balanced (only one class found)")

min_count = counts.min()

df_balanced = pd.concat([
    df[df['label'] == 0].sample(min_count, random_state=42),
    df[df['label'] == 1].sample(min_count, random_state=42)
])

# Shuffle dataset
df_balanced = df_balanced.sample(frac=1, random_state=42).reset_index(drop=True)

print("\n📊 After balancing:")
print(df_balanced['label'].value_counts())


# ---------------------------
# SAVE FINAL DATASET
# ---------------------------
processed_path = os.path.join(BASE_DIR, "data", "processed")
os.makedirs(processed_path, exist_ok=True)

output_file = os.path.join(processed_path, "final_dataset.csv")
df_balanced['label'] = df_balanced['label'].astype(int)
df_balanced.to_csv(output_file, index=False)

print("\n✅ Final dataset saved at:", output_file)
print("📦 Final Shape:", df_balanced.shape)