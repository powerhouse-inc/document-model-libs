/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { toArray } from '../../../../editors/arb-ltip/util';
import { ArbitrumLtipGranteeMetaOperations } from '../../gen/meta/operations';

export const reducer: ArbitrumLtipGranteeMetaOperations = {
    addMetaOperation(state, action, dispatch) {
        if (!action.input.protocolVersion) {
            throw new Error('protocolVersion is required');
        }

        if (!action.input.value) {
            throw new Error('value is required');
        }

        if (!state.meta) {
            state.meta = [];
        }

        state.meta.push({
            protocolVersion: action.input.protocolVersion,
            isAdmin: action.input.isAdmin === true,
            value: action.input.value,
        });
    },
    updateMetaOperation(state, action, dispatch) {
        if (!state.meta || state.meta.length === 0) {
            throw new Error('no meta to update');
        }

        const index = action.input.index || 0;
        if (index < 0 || index >= state.meta.length) {
            throw new Error('invalid index');
        }

        const meta = toArray(state.meta)[index];
        if (meta.isAdmin) {
            throw new Error('unauthorized');
        }

        if (action.input.protocolVersion) {
            meta.protocolVersion = action.input.protocolVersion;
        }

        if (action.input.value) {
            meta.value = action.input.value;
        }

        if (action.input.isAdmin) {
            meta.isAdmin = action.input.isAdmin;
        }
    },
    deleteMetaOperation(state, action, dispatch) {
        if (!state.meta || state.meta.length === 0) {
            throw new Error('no meta to delete');
        }

        const index = action.input.index || 0;
        if (index < 0 || index >= state.meta.length) {
            throw new Error('invalid index');
        }

        const meta = toArray(state.meta)[index];
        if (meta.isAdmin) {
            throw new Error('unauthorized');
        }

        state.meta.splice(index, 1);
    },
};
