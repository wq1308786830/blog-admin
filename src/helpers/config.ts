const env = process.env.NODE_ENV;

const Config = {
  foreignPrefix: 'http://gin.web-framework-wcof.1681718655914897.cn-hangzhou.fc.devsapp.net',
  production: 'http://gin.web-framework-wcof.1681718655914897.cn-hangzhou.fc.devsapp.net',
  development: 'http://localhost:5002',
  test: 'http://gin.web-framework-wcof.1681718655914897.cn-hangzhou.fc.devsapp.net',
};

const prefix = Config[env];

window.console.log(env);

export default {
  env,
  Config,
  prefix
};
