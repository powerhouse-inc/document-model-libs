import { ArbitrumLtipGranteeAdminOperations } from '../../gen/admin/operations';
import { isAdminRole } from '../utils';
import validators from '../validators';

export const reducer: ArbitrumLtipGranteeAdminOperations = {
    addEditorOperation(state, action, dispatch) {
        const signer = action.context?.signer?.user.address;
        if (!isAdminRole(state, signer)) {
            throw new Error(`Unauthorized signer`);
        }

        const { editorAddress } = action.input;
        if (!validators.isValidAddress(editorAddress)) {
            throw new Error('Invalid address');
        }

        const editorAddresses = new Set(state.editorAddresses);
        editorAddresses.add(editorAddress);

        state.editorAddresses = Array.from(editorAddresses);
    },
    removeEditorOperation(state, action, dispatch) {
        const signer = action.context?.signer?.user.address;
        if (!isAdminRole(state, signer)) {
            throw new Error(`Unauthorized signer`);
        }

        const { editorAddress } = action.input;
        if (!validators.isValidAddress(editorAddress)) {
            throw new Error('Invalid address');
        }

        const editorAddresses = new Set(state.editorAddresses);
        editorAddresses.delete(editorAddress);

        state.editorAddresses = Array.from(editorAddresses);
    },
};
