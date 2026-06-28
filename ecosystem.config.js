module.exports = {
  apps: [{
    name: "delta-school-backend",
    script: "./backend/server.js",
    instances: "max",       // Utilize all available CPU cores
    exec_mode: "cluster",   // Run in cluster mode for zero-downtime reloads
    watch: false,           // Disable watch in production
    env: {
      NODE_ENV: "development",
      PORT: 5000
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 5000,
      MONGO_URI: "mongodb://localhost:27017/delta_school", // Ensure this is secured in prod
      JWT_SECRET: "your_super_secure_production_secret"
    },
    error_file: "./logs/err.log",
    out_file: "./logs/out.log",
    log_file: "./logs/combined.log",
    time: true
  }]
};
