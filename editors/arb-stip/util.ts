import { Maybe } from 'document-models/document-drive';
import { Phase } from '../../document-models/arbitrum-stip-grantee';
import validators from '../../document-models/arbitrum-stip-grantee/src/validators';

export function maybeToArray<T>(value: Maybe<Maybe<T>[]>): T[] {
    if (!value) {
        return [];
    }

    return value.filter(v => v !== null) as T[];
}

export function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export function toArray<T>(value: Maybe<Array<Maybe<T>>>): T[] {
    return value?.map(v => v as T) || [];
}

export const pad = (num: string, size: number) => {
    let s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
};

export const formatDate = (date: string) => {
    const parts = new Date(date).toLocaleDateString('en-US').split('/');
    return `${pad(parts[0], 2)} / ${pad(parts[1], 2)}`;
};

export const calculateDaysRemaining = (phases: Phase[]) => {
    const firstPhase = phases[0];
    const lastPhase = phases[phases.length - 1];

    let start = new Date();
    if (start < new Date(firstPhase.startDate)) {
        start = new Date(firstPhase.startDate);
    }

    const end = new Date(lastPhase.endDate);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const calculateArbReceived = (phases: Phase[]) => {
    let total = 0;
    for (const phase of phases) {
        total += phase.actuals?.arbReceived || 0;
    }

    return total;
};

export const calculateStatus = (phases: Phase[]) => {
    const now = new Date();
    for (const phase of phases) {
        const isPhaseStarted = new Date(phase.startDate) < now;
        const isPhaseComplete = new Date(phase.endDate) < now;
        const isPhaseInProgress = isPhaseStarted && !isPhaseComplete;

        if (!isPhaseStarted) {
            break;
        }

        const isPlannedValid =
            !!phase.planned && validators.isPlannedValid(phase.planned);
        const isActualsValid =
            !!phase.actuals && validators.isActualsValid(phase.actuals);
        const isStatsValid =
            !!phase.stats && validators.isStatsValid(phase.stats);

        if (isPhaseInProgress) {
            if (!isPlannedValid) {
                return 'Overdue';
            }
        }

        if (isPhaseComplete) {
            if (!isPlannedValid || !isActualsValid || !isStatsValid) {
                return 'Overdue';
            }
        }
    }

    return 'On Track';
};

export const intHandler =
    (setFn: (value: number) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            setFn(0);
            return;
        }

        e.target.value = e.target.value.replace(/\D/g, '');

        const value = parseInt(e.target.value, 10);
        if (isNaN(value)) {
            return;
        }

        setFn(value);
    };

export const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;
