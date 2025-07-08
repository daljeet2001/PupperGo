import Redis from 'ioredis';
const redisClient = new Redis("redis://localhost:6379");
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});
export default redisClient;







