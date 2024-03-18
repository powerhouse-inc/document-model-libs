import { IProps } from '../editor';
import PlannedResourcesForm from './PlannedResourcesForm';
import PhaseTimeline from './PhaseTimeline';
import { useMemo } from 'react';
import ReportingForm from './ReportingForm';
import FinalizingForm from './FinalizingForm';
import useTodoPhase from '../hooks/use-todo-phase';
import validators from '../../../document-models/arb-ltip-grantee/src/validators';

type PhaseDisplayProps = IProps;
const PhaseDisplay = (props: PhaseDisplayProps) => {
    const [phase, phaseIndex] = useTodoPhase(props.document);
    const status = useMemo(() => {
        if (!phase) {
            return 'Invalid';
        }

        switch (phase.status) {
            case 'NotStarted': {
                return 'Start';
            }
            case 'InProgress': {
                return 'InProgress';
            }
            case 'Finalized': {
                return 'Finalize';
            }
            default: {
                return 'Invalid';
            }
        }
    }, [phase]);

    return (
        <div>
            {phase && status !== 'Invalid' && (
                <>
                    <PhaseTimeline status={status} />

                    {status === 'Start' && (
                        <PlannedResourcesForm
                            phase={phase}
                            phaseIndex={phaseIndex}
                            {...props}
                        />
                    )}
                    {status === 'InProgress' && (
                        <ReportingForm
                            phase={phase}
                            phaseIndex={phaseIndex}
                            {...props}
                        />
                    )}
                    {status === 'Finalize' && (
                        <FinalizingForm
                            phase={phase}
                            phaseIndex={phaseIndex}
                            {...props}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default PhaseDisplay;
