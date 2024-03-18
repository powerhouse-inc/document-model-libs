import { Document } from 'document-model/document';
import {
    ArbLtipGranteeAction,
    ArbLtipGranteeLocalState,
    ArbLtipGranteeState,
    Phase,
} from '../../../document-models/arb-ltip-grantee';
import { Maybe } from 'document-model/document-model';

// finds the next phase that needs attention
const useTodoPhase = (
    document: Document<
        ArbLtipGranteeState,
        ArbLtipGranteeAction,
        ArbLtipGranteeLocalState
    >,
): [Maybe<Phase>, number] => {
    const phases = document.state.global.phases;
    if (!phases) {
        return [null, -1];
    }

    const now = Date.now();
    for (let i = 0; i < phases.length; i++) {
        const phase = phases[i];
        if (!phase) {
            continue;
        }

        const phaseStart = new Date(phase.startDate).getTime();
        if (phase.status !== 'Finalized' && phaseStart < now) {
            return [phase, i];
        }
    }

    return [phases[0]!, 0];
};

export default useTodoPhase;
