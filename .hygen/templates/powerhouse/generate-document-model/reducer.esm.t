---
to: "./src/<%= h.changeCase.param(documentType) %>/gen/reducer.ts"
force: true
---
import { isBaseAction } from "../../document/actions/types";
import { createReducer } from "../../document/utils";
import { ImmutableReducer } from "../../document/types";
import { WritableDraft } from "immer/dist/internal";

import { <%= h.changeCase.pascal(documentType) %>State, z } from '@acaldas/document-model-graphql/<%= h.changeCase.param(documentType) %>';
import { <%= h.changeCase.pascal(documentType) %>Action } from './actions';
import { Extended<%= h.changeCase.pascal(documentType) %>State } from './types';

<% modules.forEach(m => { _%>
import { reducer as <%= h.changeCase.pascal(m.name) %>Reducer } from '../custom/reducers/<%= h.changeCase.param(m.name) %>';
<%_ }); %>

type Immutable<%= h.changeCase.pascal(documentType) %>State = WritableDraft<Extended<%= h.changeCase.pascal(documentType) %>State>;

const stateReducer: ImmutableReducer<<%= h.changeCase.pascal(documentType) %>State, <%= h.changeCase.pascal(documentType) %>Action> =
    (state: Immutable<%= h.changeCase.pascal(documentType) %>State, action: <%= h.changeCase.pascal(documentType) %>Action) => {
        if (isBaseAction(action)) {
            return state;
        }

        switch (action.type) {
<%-
    modules.map(m => m.operations.map(o => 
        '            case "' + h.changeCase.constant(o.name) + '":\n' + 
        '                ' + 'z.' + h.changeCase.pascalCase(o.name) + 'InputSchema().parse(action.input);\n' +
        '                ' + h.changeCase.pascal(m.name) + 'Reducer.' + h.changeCase.camel(o.name) + 'Operation(state, action);\n' +
        '                break;\n'        
    ).join('\n')).join('\n')
%>
            default:
                return state;
        }
    }

export const reducer = createReducer<<%= h.changeCase.pascal(documentType) %>State, <%= h.changeCase.pascal(documentType) %>Action>(stateReducer);
