import { setName } from '../../src/document/actions';
import { SET_NAME } from '../../src/document/actions/types';
import { createAction, createDocument } from '../../src/document/utils';
import { emptyReducer } from '../helpers';

describe('Base reducer', () => {
    beforeAll(() => {
        jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
    });

    it('should update revision', async () => {
        const state = createDocument();
        const newState = emptyReducer(state, { type: 'TEST' });
        expect(newState.revision).toBe(1);
    });

    it('should update lastModified', async () => {
        jest.useFakeTimers();
        const state = createDocument();
        await new Promise(r => {
            setTimeout(r, 100);
            jest.runOnlyPendingTimers();
        });
        const newState = emptyReducer(state, { type: 'TEST' });
        expect(newState.lastModified > state.lastModified).toBe(true);
        jest.useRealTimers();
    });

    it('should update operations list', async () => {
        jest.useFakeTimers({ now: new Date('2023-01-01') });
        const state = createDocument();
        const newState = emptyReducer(state, { type: 'TEST' });

        expect(newState.operations).toStrictEqual([
            {
                type: 'TEST',
                timestamp: new Date().toISOString(),
                index: 0,
                hash: 'BQ4ZKqKZEKMUNq107drPOg==',
            },
        ]);
    });

    it('should throw error when creating action with non-string type', () => {
        expect(() => createAction(1 as never)).toThrow();
    });

    it('should throw error when creating action with empty type', () => {
        expect(() => createAction('')).toThrow();
    });

    it('should create SET_NAME action', () => {
        const setNameAction = setName('Document');
        expect(setNameAction).toStrictEqual({
            type: SET_NAME,
            input: 'Document',
        });
    });

    it('should set document name', async () => {
        const state = createDocument();
        const newState = emptyReducer(state, setName('Document'));
        expect(newState.name).toBe('Document');
    });
});
