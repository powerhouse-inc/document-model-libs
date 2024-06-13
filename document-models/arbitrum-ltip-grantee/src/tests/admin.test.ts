/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from '@powerhousedao/codegen';

import utils from '../../gen/utils';
import { z } from '../../gen/schema';
import { reducer } from '../../gen/reducer';
import * as creators from '../../gen/admin/creators';
import { ArbitrumLtipGranteeDocument } from '../../gen/types';
import { toArray } from '../../../../editors/arb-ltip/util';
import { createContext, expectException, signer } from '../utils';

const addr = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045';

describe('Admin Operations', () => {
    let document: ArbitrumLtipGranteeDocument;

    beforeEach(() => {
        document = utils.createDocument();
        document.state.global.authorizedSignerAddress = signer;
        document.state.global.editorAddresses = [addr];
    });

    it('addEditor should add a new address', () => {
        const input = generateMock(z.AddEditorInputSchema());
        input.editorAddress = '0xbAC3f1Cc5aFAB1891b6332064C949a0fE1cdf712';

        const action = creators.addEditor(input);
        action.context = createContext();

        const updatedDocument = reducer(document, action);

        expect(updatedDocument.state.global.editorAddresses).not.toBeNull();
        expect(updatedDocument.state.global.editorAddresses).toHaveLength(2);

        const arr = toArray(updatedDocument.state.global.editorAddresses);
        expect(arr[1]).toBe(input.editorAddress);
    });

    it('addEditor should not add duplicate addresses', () => {
        const input = generateMock(z.AddEditorInputSchema());
        input.editorAddress = addr;

        const action = creators.addEditor(input);
        action.context = createContext();

        const updatedDocument = reducer(document, action);

        expect(updatedDocument.state.global.editorAddresses).not.toBeNull();
        expect(updatedDocument.state.global.editorAddresses).toHaveLength(1);
    });

    it('addEditor should reject invalid addresses', () => {
        const input = generateMock(z.AddEditorInputSchema());
        input.editorAddress = '0x123';

        const action = creators.addEditor(input);
        action.context = createContext();

        expectException(reducer(document, action), 'Invalid address');
    });

    it('removeEditor should remove an address', () => {
        const input = generateMock(z.RemoveEditorInputSchema());
        input.editorAddress = addr;

        const action = creators.removeEditor(input);
        action.context = createContext();

        const updatedDocument = reducer(document, action);

        expect(updatedDocument.state.global.editorAddresses).not.toBeNull();
        expect(updatedDocument.state.global.editorAddresses).toHaveLength(0);
    });

    it('removeEditor should not remove non-existent addresses', () => {
        const input = generateMock(z.RemoveEditorInputSchema());
        input.editorAddress = '0xbAC3f1Cc5aFAB1891b6332064C949a0fE1cdf712';

        const action = creators.removeEditor(input);
        action.context = createContext();

        const updatedDocument = reducer(document, action);

        expect(updatedDocument.state.global.editorAddresses).not.toBeNull();
        expect(updatedDocument.state.global.editorAddresses).toHaveLength(1);
    });

    it('removeEditor should reject invalid addresses', () => {
        const input = generateMock(z.RemoveEditorInputSchema());
        input.editorAddress = '0x123';

        const action = creators.removeEditor(input);
        action.context = createContext();

        expectException(reducer(document, action), 'Invalid address');
    });
});
