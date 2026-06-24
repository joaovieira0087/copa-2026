import { Redis } from '@upstash/redis';

// Inicializa o Redis apenas se as variáveis de ambiente estiverem configuradas.
// Caso contrário, usa um fallback em memória para desenvolvimento local sem custos ou configurações adicionais.
let redisClient: Redis | null = null;

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (url && token) {
  try {
    redisClient = new Redis({ url, token });
    console.log('Cache: Conectado com sucesso ao Upstash Redis.');
  } catch (error) {
    console.error('Cache: Erro ao inicializar cliente Redis. Usando fallback em memória.', error);
  }
} else {
  console.log('Cache: UPSTASH_REDIS_REST_URL/TOKEN não configurados. Usando fallback em memória (Map).');
}

// Fallback em memória
interface CacheItem {
  value: any;
  expiresAt: number | null;
}
const memoryCache = new Map<string, CacheItem>();

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (redisClient) {
    try {
      const data = await redisClient.get<T>(key);
      return data;
    } catch (error) {
      console.error(`Cache: Erro ao buscar chave "${key}" no Redis. Usando fallback em memória.`, error);
    }
  }

  const item = memoryCache.get(key);
  if (!item) return null;

  if (item.expiresAt && item.expiresAt < Date.now()) {
    memoryCache.delete(key);
    return null;
  }

  return item.value as T;
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
  if (redisClient) {
    try {
      if (ttlSeconds) {
        await redisClient.set(key, value, { ex: ttlSeconds });
      } else {
        await redisClient.set(key, value);
      }
      return;
    } catch (error) {
      console.error(`Cache: Erro ao salvar chave "${key}" no Redis. Usando fallback em memória.`, error);
    }
  }

  const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
  memoryCache.set(key, { value, expiresAt });
}

export async function cacheDelete(key: string): Promise<void> {
  if (redisClient) {
    try {
      await redisClient.del(key);
      return;
    } catch (error) {
      console.error(`Cache: Erro ao deletar chave "${key}" no Redis. Usando fallback em memória.`, error);
    }
  }

  memoryCache.delete(key);
}

export async function cacheKeys(pattern: string): Promise<string[]> {
  if (redisClient) {
    try {
      // O Upstash Redis suporta scan/keys
      return await redisClient.keys(pattern);
    } catch (error) {
      console.error(`Cache: Erro ao listar chaves com padrão "${pattern}" no Redis. Usando fallback em memória.`, error);
    }
  }

  const keys: string[] = [];
  const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
  const now = Date.now();

  for (const [key, item] of memoryCache.entries()) {
    if (item.expiresAt && item.expiresAt < now) {
      memoryCache.delete(key);
      continue;
    }
    if (regex.test(key)) {
      keys.push(key);
    }
  }

  return keys;
}
