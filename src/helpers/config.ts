const env = process.env.NODE_ENV;

const Config = {
  foreignPrefix: 'http://104.156.250.95:7001',
  production: 'http://81.69.247.116:5002',
  development: 'http://localhost:5002',
  test: 'http://localhost:5002',
};

const prefix = Config[env];

window.console.log(env);

export default {
  env,
  Config,
  prefix
};
