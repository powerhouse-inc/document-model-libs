/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from '@powerhousedao/codegen';

import utils from '../../gen/utils';
import { InitGranteeInput, z } from '../../gen/schema';
import { reducer } from '../../gen/reducer';
import * as creators from '../../gen/general/creators';
import { ArbLtipGranteeDocument } from '../../gen/types';
import {
    createContext,
    expectException,
    expectNoException,
    signer,
} from './util';
import { toArray } from '../../../../editors/arb-ltip/util';

describe('General Operations', () => {
    let document: ArbLtipGranteeDocument;

    beforeEach(() => {
        document = utils.createDocument();
        document.state.global.authorizedSignerAddress = signer;
    });

    it('should handle initGrantee operation from anyone', () => {
        const input: InitGranteeInput = {
            authorizedSignerAddress:
                '0xe6b8a5cf854791412c1f6efc7caf629f5df1c747',
            disbursementContractAddress:
                '0xe6b8a5cf854791412c1f6efc7caf629f5df1c747',
            fundingAddress: '0xe6b8a5cf854791412c1f6efc7caf629f5df1c747',
            fundingType: ['EOA'],
            grantSize: 100,
            grantSummary: 'Summary',
            granteeName: 'Name',
            metricsDashboardLink: 'https://example.com',
            matchingGrantSize: 10,
            numberOfPhases: 10,
            phaseDuration: 1,
            startDate: new Date().toISOString(),
        };

        document.state.global.authorizedSignerAddress = '';
        const updatedDocument = reducer(document, creators.initGrantee(input));
        expectNoException(updatedDocument);

        expect(updatedDocument.state.global.authorizedSignerAddress).toBe(
            input.authorizedSignerAddress,
        );
        expect(updatedDocument.state.global.disbursementContractAddress).toBe(
            input.disbursementContractAddress,
        );
        expect(updatedDocument.state.global.fundingAddress).toBe(
            input.fundingAddress,
        );
        expect(updatedDocument.state.global.fundingType).toStrictEqual(
            input.fundingType,
        );
        expect(updatedDocument.state.global.grantSize).toBe(input.grantSize);
        expect(updatedDocument.state.global.grantSummary).toBe(
            input.grantSummary,
        );
        expect(updatedDocument.state.global.granteeName).toBe(
            input.granteeName,
        );
        expect(updatedDocument.state.global.matchingGrantSize).toBe(
            input.matchingGrantSize,
        );
        expect(updatedDocument.state.global.metricsDashboardLink).toBe(
            input.metricsDashboardLink,
        );
        expect(updatedDocument.state.global.phases).toHaveLength(10);
    });

    it('should reject editGrantee operation from unauthorized signer', () => {
        const input = generateMock(z.EditGranteeInputSchema());
        input.grantSummary = 'foo';

        expectException(
            reducer(document, creators.editGrantee(input)),
            'Unauthorized signer',
        );
    });

    it('should allow the editGrantee operation from the root user', () => {
        const input = generateMock(z.EditGranteeInputSchema());
        input.authorizedSignerAddress = '';
        input.disbursementContractAddress =
            '0xe6b8a5cf854791412c1f6efc7caf629f5df1c747';
        input.fundingAddress = '0xe6b8a5cf854791412c1f6efc7caf629f5df1c747';

        const action = creators.editGrantee(input);
        action.context = createContext();

        const updatedDocument = reducer(document, action);
        expectNoException(updatedDocument);

        expect(updatedDocument.state.global.disbursementContractAddress).toBe(
            input.disbursementContractAddress,
        );
        expect(updatedDocument.state.global.fundingAddress).toBe(
            input.fundingAddress,
        );
    });

    it('should allow the editGrantee operation from an editor user', () => {
        // add the editor to the document
        const editor = '0xe6b8a5cf854791412c1f6efc7caf629f5df1c747';
        document.state.global.editorAddresses = [editor];

        const input = generateMock(z.EditGranteeInputSchema());
        input.authorizedSignerAddress = signer;
        input.disbursementContractAddress = editor;
        input.fundingAddress = editor;
        input.grantSummary = 'THIS IS A TEST';

        const action = creators.editGrantee(input);
        action.context = createContext(editor);

        const updatedDocument = reducer(document, action);
        expectNoException(updatedDocument);

        expect(updatedDocument.state.global.grantSummary).toBe(
            input.grantSummary,
        );
    });

    it('should create editor permission for editGrantee authorized signer change', () => {
        const input = generateMock(z.EditGranteeInputSchema());
        input.authorizedSignerAddress =
            '0xe6b8a5cf854791412c1f6efc7caf629f5df1c747';
        input.disbursementContractAddress = '';
        input.fundingAddress = '';

        const action = creators.editGrantee(input);
        action.context = createContext();

        const updatedDocument = reducer(document, action);
        expectNoException(updatedDocument);

        expect(updatedDocument.state.global.editorAddresses).toHaveLength(1);
        expect(toArray(updatedDocument.state.global.editorAddresses)[0]).toBe(
            signer,
        );
        expect(updatedDocument.state.global.authorizedSignerAddress).toBe(
            input.authorizedSignerAddress,
        );
    });

    it('should remove editor permission for editGrantee authorized signer change', () => {
        document.state.global.editorAddresses = [signer];
        document.state.global.authorizedSignerAddress =
            '0xe6b8a5cf854791412c1f6efc7caf629f5df1c747';

        const input = generateMock(z.EditGranteeInputSchema());
        input.authorizedSignerAddress = signer;
        input.disbursementContractAddress = '';
        input.fundingAddress = '';

        const action = creators.editGrantee(input);
        action.context = createContext(
            document.state.global.authorizedSignerAddress,
        );

        const updatedDocument = reducer(document, action);
        expectNoException(updatedDocument);

        expect(updatedDocument.state.global.editorAddresses).toHaveLength(1);
        expect(toArray(updatedDocument.state.global.editorAddresses)[0]).toBe(
            '0xe6b8a5cf854791412c1f6efc7caf629f5df1c747',
        );
        expect(updatedDocument.state.global.authorizedSignerAddress).toBe(
            signer,
        );
    });
});
