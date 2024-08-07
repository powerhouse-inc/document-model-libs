/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from '@powerhousedao/codegen';

import utils from '../../gen/utils';
import { InitGranteeInput, z } from '../../gen/schema';
import { reducer } from '../../gen/reducer';
import * as creators from '../../gen/general/creators';
import { ArbitrumLtipGranteeDocument } from '../../gen/types';
import {
    createContext,
    expectException,
    expectNoException,
    signer,
} from '../utils';
import { toArray } from '../../../../editors/arb-ltip/util';

const generateInitGranteeInput = (): InitGranteeInput => ({
    authorizedSignerAddress: '0xe6b8a5cf854791412c1f6efc7caf629f5df1c747',
    disbursementContractAddress: '0xe6b8a5cf854791412c1f6efc7caf629f5df1c747',
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
});

describe('General Operations', () => {
    let document: ArbitrumLtipGranteeDocument;

    beforeEach(() => {
        document = utils.createDocument();
        document.state.global.authorizedSignerAddress = signer;
    });

    it('should handle initGrantee operation from anyone', () => {
        const input: InitGranteeInput = generateInitGranteeInput();

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

    it('initGrantee should deny invalid formatting for multiple funding addresses', () => {
        document.state.global.authorizedSignerAddress = '';

        const input: InitGranteeInput = generateInitGranteeInput();
        input.fundingAddress =
            input.fundingAddress + ' ' + input.fundingAddress;

        expectException(
            reducer(document, creators.initGrantee(input)),
            'fundingAddress is improperly formatted',
        );
    });

    it('initGrantee should allow properly formatted multiple funding addresseses', () => {
        document.state.global.authorizedSignerAddress = '';

        const input: InitGranteeInput = generateInitGranteeInput();
        input.fundingAddress =
            input.fundingAddress + ',' + input.fundingAddress;

        expectNoException(reducer(document, creators.initGrantee(input)));
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

    it('should generate the same phase dates for different timezones', () => {
        const input: InitGranteeInput = generateInitGranteeInput();
        input.startDate = new Date(Date.UTC(2024, 7, 17)).toISOString();
        input.phaseDuration = 14;
        expect(input.startDate).toBe('2024-08-17T00:00:00.000Z');

        document.state.global.authorizedSignerAddress = '';
        const updatedDocument = reducer(document, creators.initGrantee(input));
        expectNoException(updatedDocument);

        expect(
            updatedDocument.state.global.phases?.map(p => p?.startDate),
        ).toStrictEqual([
            '2024-08-17T07:00:00.000Z',
            '2024-08-31T07:00:00.000Z',
            '2024-09-14T07:00:00.000Z',
            '2024-09-28T07:00:00.000Z',
            '2024-10-12T07:00:00.000Z',
            '2024-10-26T07:00:00.000Z',
            '2024-11-09T07:00:00.000Z',
            '2024-11-23T07:00:00.000Z',
            '2024-12-07T07:00:00.000Z',
            '2024-12-21T07:00:00.000Z',
        ]);

        expect(
            updatedDocument.state.global.phases?.map(p => p?.endDate),
        ).toStrictEqual([
            '2024-08-31T07:00:00.000Z',
            '2024-09-14T07:00:00.000Z',
            '2024-09-28T07:00:00.000Z',
            '2024-10-12T07:00:00.000Z',
            '2024-10-26T07:00:00.000Z',
            '2024-11-09T07:00:00.000Z',
            '2024-11-23T07:00:00.000Z',
            '2024-12-07T07:00:00.000Z',
            '2024-12-21T07:00:00.000Z',
            '2025-01-04T07:00:00.000Z',
        ]);

        // checks daylight savings time change
        process.env.TZ = 'Chile/Continental';

        const input2: InitGranteeInput = generateInitGranteeInput();
        input2.startDate = new Date(Date.UTC(2024, 7, 17)).toISOString();
        input2.phaseDuration = 14;

        expect(input2.startDate).toBe('2024-08-17T00:00:00.000Z');

        const updatedDocument2 = reducer(
            document,
            creators.initGrantee(input2),
        );
        expectNoException(updatedDocument2);

        expect(
            updatedDocument2.state.global.phases?.map(p => p?.startDate),
        ).toStrictEqual([
            '2024-08-17T07:00:00.000Z',
            '2024-08-31T07:00:00.000Z',
            '2024-09-14T07:00:00.000Z',
            '2024-09-28T07:00:00.000Z',
            '2024-10-12T07:00:00.000Z',
            '2024-10-26T07:00:00.000Z',
            '2024-11-09T07:00:00.000Z',
            '2024-11-23T07:00:00.000Z',
            '2024-12-07T07:00:00.000Z',
            '2024-12-21T07:00:00.000Z',
        ]);

        expect(
            updatedDocument2.state.global.phases?.map(p => p?.endDate),
        ).toStrictEqual([
            '2024-08-31T07:00:00.000Z',
            '2024-09-14T07:00:00.000Z',
            '2024-09-28T07:00:00.000Z',
            '2024-10-12T07:00:00.000Z',
            '2024-10-26T07:00:00.000Z',
            '2024-11-09T07:00:00.000Z',
            '2024-11-23T07:00:00.000Z',
            '2024-12-07T07:00:00.000Z',
            '2024-12-21T07:00:00.000Z',
            '2025-01-04T07:00:00.000Z',
        ]);
    });
});
