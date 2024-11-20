/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { ToDoListToDoListOperations } from '../../gen/to-do-list/operations';

export const reducer: ToDoListToDoListOperations = {
    addTodoItemOperation(state, action, dispatch) {
        state.stats.total += 1;
        state.stats.unchecked += 1;
        state.items.push({
            id: action.input.id,
            text: action.input.text,
            checked: false,
        });
    },
    updateTodoItemOperation(state, action, dispatch) {
        const item = state.items.find(item => item.id === action.input.id);
        if (!item) {
            throw new Error(`Item with id ${action.input.id} not found`);
        }
        if (action.input.text) {
            item.text = action.input.text;
        }
        if (action.input.checked) {
            state.stats.unchecked -= 1;
            state.stats.checked += 1;
            item.checked = action.input.checked;
        }
        if (action.input.checked === false) {
            state.stats.unchecked += 1;
            state.stats.checked -= 1;
            item.checked = action.input.checked;
        }
    },
    deleteTodoItemOperation(state, action, dispatch) {
        const item = state.items.find(item => item.id === action.input.id);
        state.stats.total -= 1;
        if (item?.checked) {
            state.stats.checked -= 1;
        }
        if (item?.checked === false) {
            state.stats.unchecked -= 1;
        }
        state.items = state.items.filter(item => item.id !== action.input.id);
    },
};
