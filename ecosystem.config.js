module.exports = {
  apps: [
    {
      name: 'wtwr-api',
      script: 'app.js',          // or your entry script
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        PORT: 3001,
        NODE_ENV: 'production',
        MONGODB_URI: 'mongodb://127.0.0.1:27017/wtwr_db'
      },
      env_production: {
        PORT: 3001,
        NODE_ENV: 'production',
        MONGODB_URI: 'mongodb://127.0.0.1:27017/wtwr_db'
      }
    }
  ]
};