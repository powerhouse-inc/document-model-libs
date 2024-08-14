import {
    ArbitrumStipGranteeState,
    Phase,
} from '../../../document-models/arbitrum-stip-grantee';
import PhaseTimespan from './PhaseTimespan';
import PhasePlanned from './PhasePlanned';
import PhaseActuals from './PhaseActuals';
import { Icon } from '@powerhousedao/design-system';
import { useMemo } from 'react';
import { correctPhases } from '../../arb-ltip/util';

type PhaseSummaryProps = {
    state: ArbitrumStipGranteeState;
    phaseIndex: number;
    onClose: () => void;
};
const PhaseSummary = ({ phaseIndex, state, onClose }: PhaseSummaryProps) => {
    const phases = useMemo(() => correctPhases(state.phases), [state.phases]);
    if (phaseIndex < 0 || phaseIndex >= phases.length) {
        return null;
    }

    const phase = phases[phaseIndex];

    return (
        <div>
            <div className="flex pt-4">
                <Icon
                    className="cursor-pointer"
                    name="BaseArrowLeft"
                    onClick={onClose}
                />
                <span className="cursor-pointer" onClick={onClose}>
                    Back
                </span>
            </div>
            <div className="my-4">
                <PhaseTimespan phase={phase} />
                {phase.status === 'Finalized' && (
                    <PhaseActuals state={state} phaseIndex={phaseIndex} />
                )}
                <PhasePlanned phase={phase} />
            </div>
        </div>
    );
};

export default PhaseSummary;
