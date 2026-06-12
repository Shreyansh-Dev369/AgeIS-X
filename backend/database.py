import psycopg2
import config

def get_connection():
    conn = psycopg2.connect(
        host=config.DB_HOST,
        port=config.DB_PORT,
        dbname=config.DB_NAME,
        user=config.DB_USER,
        password=config.DB_PASSWORD
    )
    return conn

def log_prediction(url: str, label: int, probability: float):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO predictions (url, label, probability, created_at) VALUES (%s, %s, %s, NOW())",
        (url, label, probability)
    )
    conn.commit()
    cur.close()
    conn.close()