import redis
import config

r = redis.Redis(
    host=config.REDIS_HOST,
    port=config.REDIS_PORT,
    db=config.REDIS_DB,
    decode_responses=True
)

def cache_result(key: str, value: str, expire=config.REDIS_EXPIRE):
    r.set(key, value, ex=expire)

def get_cached(key: str):
    return r.get(key)