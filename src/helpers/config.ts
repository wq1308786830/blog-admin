const env = process.env.NODE_ENV;

const Config = {
  foreignPrefix: 'https://blog-proxy-nine.vercel.app',
  production: 'https://blog-proxy-nine.vercel.app',
  development: 'http://localhost:5002',
  test: 'https://blog-proxy-nine.vercel.app',
};

const prefix = Config[env];

window.console.log(env);

const configExport = {
  env,
  Config,
  prefix
};

export default configExport;
