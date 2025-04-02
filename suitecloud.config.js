module.exports = {
  defaultProjectFolder: 'src',
  commands: {
      "file:upload": {
          beforeExecuting: () => {
              return {
                  arguments: {}
              };
          },
      },
      "file:list": {
          beforeExecuting: () => {
              return {
                  arguments: {}
              };
          },
      },
  },
  accountSettings: {
      authenticationMethod: 'oauth2'
  }
};