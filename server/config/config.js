var env = process.env.NODE_ENV || 'development';

console.log(`--- ENVIRONMENT : ${env} ---`);

if (env === 'development' || env === 'cloud9' || env === 'test') {
    var config = require('./config.json');
    var envConfig = config[env];
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}