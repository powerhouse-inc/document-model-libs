import { Phase } from '../../../document-models/arbitrum-ltip-grantee';
import PhaseTimespan from './PhaseTimespan';
import PhasePlanned from './PhasePlanned';
import PhaseActuals from './PhaseActuals';
import { Icon } from '@powerhousedao/design-system';

type PhaseSummaryProps = {
    phase: Phase | null;
    onClose: () => void;
};
const PhaseSummary = ({ phase, onClose }: PhaseSummaryProps) => {
    if (!phase) {
        return null;
    }

    return (
        <div>
            <div className="flex pt-4">
                <Icon
                    className="cursor-pointer"
                    name="base-arrow-left"
                    onClick={onClose}
                />
                <span className="cursor-pointer" onClick={onClose}>
                    Back
                </span>
            </div>
            <div className="my-4">
                <PhaseTimespan phase={phase} />
                {phase.status === 'Finalized' && <PhaseActuals phase={phase} />}
                <PhasePlanned phase={phase} />
            </div>
        </div>
    );
};

export default PhaseSummary;
