import sql from 'mssql';

let poolSize = process.env.REACT_APP_DATABASE_POOL_SIZE ? parseInt(process.env.REACT_APP_DATABASE_POOL_SIZE) : 10;

export const config = {
  user: process.env.REACT_APP_USER,
  password: process.env.REACT_APP_PASSWORD,
  server: process.env.REACT_APP_SERVER,
  database: process.env.REACT_APP_DATABASE,
  options: {
    // Configure connection timeout in milliseconds
    connectionTimeout: 60000,
    // Configure request timeout in milliseconds
    requestTimeout: 300000
  },
  pool: {
    // Configure the maximum number of concurrent connections
    max: poolSize,
    // Minimum number of initial connections
    min: 0,
    // Lifetime of idle connections
    idleTimeoutMillis: 300000
  }
};

export let pool;
let connection;

export async function connect() {


  if (pool) {
    return pool.connect();
  }

  try {
    console.log("config--------------2", config);
    pool = new sql.ConnectionPool(config);
    connection = await pool.connect();
    return pool;
  } catch (error) {
    // TODO: track error log
    console.error('Error connecting database:', error);
    throw error;
  }
}

export async function release(pool) {
  try {
    if (pool) {
      pool.release(connection);
    }
  } catch (error) {
    console.error('Error releasing pool:', error);
  }
}

export async function disconnect(pool) {
  try {
    if (pool) {
      await pool.close();
      console.log('Pool closed successfully.');
    }
  } catch (error) {
    console.error('Error closing connection pool:', error);
  }
}
