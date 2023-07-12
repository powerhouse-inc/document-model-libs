module.exports = {
    params: ({ args }) => {
        const filteredModules = documentModel.modules.filter(
            m => m.name === args.module
        );
        return {
            documentType: documentModel.name,
            module: args.module,
            actions:
                filteredModules.length > 0
                    ? filteredModules[0].operations.map(a => a.name)
                    : [],
        };
    },
};
