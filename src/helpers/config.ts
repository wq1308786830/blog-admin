const env = import.meta.env.MODE || '';

const Config = {
  foreignPrefix: 'https://blog-proxy-nine.vercel.app',
  production: 'https://blog-proxy-nine.vercel.app',
  development: 'https://blog-proxy-nine.vercel.app',
  test: 'https://blog-proxy-nine.vercel.app',
};

const prefix = Config[env as keyof typeof Config];

window.console.log(env);

const configExport = {
  env,
  Config,
  prefix
};

export default configExport;
