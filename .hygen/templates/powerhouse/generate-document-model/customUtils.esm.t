---
to: "./src/<%= h.changeCase.param(documentType) %>/custom/utils.ts"
unless_exists: true
---
/**
* This is a scaffold file meant for customization: 
* - modify it by implementing the empty state object
* - delete the file and run the code generator again to have it reset
*/

import { <%= h.changeCase.pascal(documentType) %>State } from "@acaldas/document-model-graphql/<%= h.changeCase.param(documentType) %>";
import { Extended<%= h.changeCase.pascal(documentType) %>State } from "../gen";

const createEmpty<%= h.changeCase.pascal(documentType) %>State = (): <%= h.changeCase.pascal(documentType) %>State => (<%- initialStateValue || '{}'%>);

const dateTimeNow = (new Date()).toISOString();
const createEmptyExtended<%= h.changeCase.pascal(documentType) %>State = (): Extended<%= h.changeCase.pascal(documentType) %>State => ({
    // Component 1: document header
    name: "",
    created: dateTimeNow,
    lastModified: dateTimeNow,
    documentType: "<%= documentTypeId %>",
    revision: 0,

    // Component 2: (strict) state object
    state: createEmpty<%= h.changeCase.pascal(documentType) %>State(),

    // Component 3: file registry
    fileRegistry: {},

    // TODO: remove operations, lift to the document level structure: operations = { fileRegistry:File[], history:Operation[] }
    operations: [],

    // TODO: remove initialState, lift to the document level (with type: ExtendedDocumentModelState)
    initialState: {
        name: "",
        created: dateTimeNow,
        lastModified: dateTimeNow,
        documentType: "<%= documentTypeId %>",
        revision: 0,
        state: createEmpty<%= h.changeCase.pascal(documentType) %>State(),
        fileRegistry: {},
        operations: []
    }
});

export { 
    createEmpty<%= h.changeCase.pascal(documentType) %>State,
    createEmptyExtended<%= h.changeCase.pascal(documentType) %>State
}