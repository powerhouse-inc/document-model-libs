import { IProps } from '../../editor';
import PlannedResourcesForm from '../forms/PlannedResourcesForm';
import PhaseTimeline from '../PhaseTimeline';
import { useMemo } from 'react';
import ReportingForm from '../forms/ReportingForm';
import FinalizingForm from '../forms/FinalizingForm';
import useTodoPhase from '../../hooks/use-todo-phase';
import validators from '../../../../document-models/arbitrum-ltip-grantee/src/validators';

type TabTodoProps = IProps;
const TabTodo = (props: TabTodoProps) => {
    const phases = props.document.state.global.phases;
    const phaseIndex = useTodoPhase(phases);

    const phase = useMemo(() => {
        if (
            !phases?.length ||
            !(phaseIndex >= 0 && phaseIndex < phases.length)
        ) {
            return null;
        }

        return phases[phaseIndex];
    }, [phases, phaseIndex]);

    const status = useMemo(() => {
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

    return (
        <div>
            {phase && status !== 'Invalid' && (
                <>
                    <PhaseTimeline status={status} />

                    {status === 'Planning' && (
                        <PlannedResourcesForm
                            state={props.document.state.global}
                            phase={phase}
                            phaseIndex={phaseIndex}
                            {...props}
                        />
                    )}
                    {status === 'Reporting' && (
                        <ReportingForm
                            state={props.document.state.global}
                            phase={phase}
                            phaseIndex={phaseIndex}
                            {...props}
                        />
                    )}
                    {status === 'Finalizing' && (
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

export default TabTodo;
