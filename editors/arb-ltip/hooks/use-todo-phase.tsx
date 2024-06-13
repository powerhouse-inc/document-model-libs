import { Phase } from '../../../document-models/arbitrum-ltip-grantee';
import { Maybe } from 'document-model/document-model';

// finds the next phase that needs attention
const useTodoPhase = (phases: Maybe<Array<Maybe<Phase>>>): number => {
    if (!phases) {
        return -1;
    }

    const now = Date.now();
    for (let i = 0; i < phases.length; i++) {
        const phase = phases[i];
        if (!phase) {
            continue;
        }

        const phaseStart = new Date(phase.startDate).getTime();
        if (phaseStart > now) {
            return i;
        }

        if (phase.status !== 'Finalized') {
            return i;
        }
    }

    return -1;
};

export default useTodoPhase;
