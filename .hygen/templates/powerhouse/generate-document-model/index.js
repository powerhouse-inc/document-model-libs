module.exports = {
    params: () => {
        return {
            documentType: documentModel.name,
            typeId: documentModel.id,
            extension: documentModel.extension,
            modules: documentModel.modules,
        };
    },
};
