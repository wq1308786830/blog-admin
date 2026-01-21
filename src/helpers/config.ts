const env = process.env.NODE_ENV;

const Config = {
  foreignPrefix: 'https://blog-proxy-nine.vercel.app',
  production: 'https://blog-proxy-nine.vercel.app',
  development: 'https://blog-proxy-nine.vercel.app',
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
