module.exports = {
    defaultProjectFolder: 'src',
    commands: {
        "file:deploy": {
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