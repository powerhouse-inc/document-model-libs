import { ArbLtipGranteeAdminOperations } from '../../gen/admin/operations';
import validators from '../validators';

export const reducer: ArbLtipGranteeAdminOperations = {
    addEditorOperation(state, action, dispatch) {
        const { editorAddress } = action.input;
        if (!validators.isValidAddress(editorAddress)) {
            throw new Error('Invalid address');
        }

        const signer = action.context?.signer?.user.address;
        const authorizedSigner = state.authorizedSignerAddress;
        if (signer !== authorizedSigner) {
            throw new Error(`Unauthorized signer`);
        }

        const editorAddresses = new Set(state.editorAddresses);
        editorAddresses.add(editorAddress);

        state.editorAddresses = Array.from(editorAddresses);
    },
    removeEditorOperation(state, action, dispatch) {
        const { editorAddress } = action.input;
        if (!validators.isValidAddress(editorAddress)) {
            throw new Error('Invalid address');
        }

        const signer = action.context?.signer?.user.address;
        const authorizedSigner = state.authorizedSignerAddress;
        if (signer !== authorizedSigner) {
            throw new Error('Unauthorized signer');
        }

        const editorAddresses = new Set(state.editorAddresses);
        editorAddresses.delete(editorAddress);

        state.editorAddresses = Array.from(editorAddresses);
    },
};
