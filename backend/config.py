import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ---------------------------
# ML PATHS
# ---------------------------
MODEL_PATH = os.path.join(BASE_DIR, "ml", "model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "ml", "vectorizer.pkl")

# ---------------------------
# REDIS CONFIG
# ---------------------------
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", 0))
REDIS_EXPIRE = int(os.getenv("REDIS_EXPIRE", 3600))  # seconds

# ---------------------------
# POSTGRES CONFIG
# ---------------------------
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", 5432))
DB_NAME = os.getenv("DB_NAME", "ageisx")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")

# ---------------------------
# JWT CONFIG
# ---------------------------
JWT_SECRET = os.getenv("JWT_SECRET", "change_this_secret")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", 60))

# ---------------------------
# DEBUG MODE
# ---------------------------
DEBUG = os.getenv("DEBUG", "True") == "True"