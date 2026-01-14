const env = process.env.NODE_ENV;

const Config = {
  foreignPrefix: 'https://blog-proxy-nine.vercel.app',
  production: 'https://blog-proxy-nine.vercel.app',
  development: 'http://localhost:5002',
  test: 'https://blog-proxy-nine.vercel.app',
};

const prefix = Config[env];

window.console.log(env);

export default {
  env,
  Config,
  prefix
};
