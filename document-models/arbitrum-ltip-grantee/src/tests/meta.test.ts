/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from '@powerhousedao/codegen';

import utils from '../../gen/utils';
import { z } from '../../gen/schema';
import { reducer } from '../../gen/reducer';
import * as creators from '../../gen/meta/creators';
import { ArbitrumLtipGranteeDocument } from '../../gen/types';
import { expectException, expectNoException } from '../utils';
import { toArray } from 'editors/arb-ltip/util';

describe('Meta Operations', () => {
    let document: ArbitrumLtipGranteeDocument;

    beforeEach(() => {
        document = utils.createDocument();
    });

    it('should bounce addMeta with no protocolVersion', () => {
        const updatedDocument = reducer(
            document,
            creators.addMeta({
                protocolVersion: '',
                value: 'FOO',
            }),
        );
        expectException(updatedDocument, 'protocolVersion is required');
    });
    it('should bounce addMeta with no value', () => {
        const updatedDocument = reducer(
            document,
            creators.addMeta({
                protocolVersion: '1.0.0',
                isAdmin: false,
            }),
        );
        expectException(updatedDocument, 'value is required');
    });
    it('should handle addMeta operation', () => {
        const action = {
            protocolVersion: '1.0.0',
            isAdmin: false,
            value: '{}',
        };
        const updatedDocument = reducer(document, creators.addMeta(action));
        expectNoException(updatedDocument);

        const meta = toArray(updatedDocument.state.global.meta);
        expect(meta).toHaveLength(1);

        const metaItem = meta[0];
        expect(metaItem.protocolVersion).toBe(action.protocolVersion);
        expect(metaItem.isAdmin).toBe(action.isAdmin);
        expect(metaItem.value).toBe(action.value);
    });
    it('should handle updateMeta operation', () => {
        document.state.global.meta = [
            {
                protocolVersion: '1.0.0',
                isAdmin: false,
                value: '{}',
            },
        ];

        const action = {
            index: 0,
            protocolVersion: '1.1.0',
            isAdmin: true,
            value: 'ARBTEST2',
        };
        const updatedDocument = reducer(document, creators.updateMeta(action));
        expectNoException(updatedDocument);

        const metaItem = toArray(updatedDocument.state.global.meta)[0];
        expect(metaItem.protocolVersion).toBe(action.protocolVersion);
        expect(metaItem.isAdmin).toBe(action.isAdmin);
        expect(metaItem.value).toBe(action.value);
    });

    it('should disallow updateMeta operation to admin meta', () => {
        document.state.global.meta = [
            {
                protocolVersion: '1.0.0',
                isAdmin: true,
                value: '{}',
            },
        ];

        const action = {
            index: 0,
            protocolVersion: '1.1.0',
            isAdmin: true,
            value: 'ARBTEST2',
        };
        const updatedDocument = reducer(document, creators.updateMeta(action));
        expectException(updatedDocument, 'unauthorized');
    });

    it('should handle deleteMeta operation', () => {
        document.state.global.meta = [
            {
                protocolVersion: '1.0.0',
                isAdmin: false,
                value: '{}',
            },
        ];

        const action = { index: 0 };
        const updatedDocument = reducer(document, creators.deleteMeta(action));

        expectNoException(updatedDocument);
        expect(updatedDocument.state.global.meta).toHaveLength(0);
    });

    it('should disallow deleteMeta for admins', () => {
        document.state.global.meta = [
            {
                protocolVersion: '1.0.0',
                isAdmin: true,
                value: '{}',
            },
        ];

        const action = { index: 0 };
        const updatedDocument = reducer(document, creators.deleteMeta(action));

        expectException(updatedDocument, 'unauthorized');
    });
});
