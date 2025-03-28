module.exports = {
  defaultProjectFolder: 'src',
  commands: {
    "project:deploy": {
      beforeExecuting: () => {
        return true;
      },
    },
  },
  accountSettings: {
    authenticationMethod: 'oauth2'
  }
};