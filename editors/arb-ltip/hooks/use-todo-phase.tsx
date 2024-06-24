import { useMemo } from 'react';
import { Phase } from '../../../document-models/arbitrum-ltip-grantee';
import { Maybe } from 'document-model/document-model';
import validators from '../../../document-models/arbitrum-ltip-grantee/src/validators';

// finds the next phase that needs attention
export const useTodoPhaseIndex = (
    phases: Maybe<Array<Maybe<Phase>>>,
): number => {
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

export const useTodoPhase = (phases: Maybe<Array<Maybe<Phase>>>) => {
    const phaseIndex = useTodoPhaseIndex(phases);

    return useMemo(() => {
        if (
            !phases?.length ||
            !(phaseIndex >= 0 && phaseIndex < phases.length)
        ) {
            return null;
        }

        return phases[phaseIndex];
    }, [phases, phaseIndex]);
};

export const usePhaseStatus = (phase: Phase | null) =>
    useMemo(() => {
        if (!phase) {
            return 'Invalid';
        }

        const now = Date.now();
        const phaseEnd = new Date(phase.endDate).getTime();
        const phaseStart = new Date(phase.startDate).getTime();
        const isPlannedValid =
            !!phase.planned && validators.isPlannedValid(phase.planned);
        const isActualsValid =
            !!phase.actuals && validators.isActualsValid(phase.actuals);

        if (now < phaseStart) {
            return 'Planning';
        }

        if (!isPlannedValid) {
            return 'Planning';
        }

        if (!isActualsValid) {
            return 'Reporting';
        }

        if (now > phaseEnd) {
            return 'Finalizing';
        }

        return 'Reporting';
    }, [phase]);
