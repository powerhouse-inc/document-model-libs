import { IProps } from '../../editor';
import PlannedResourcesForm from '../forms/PlannedResourcesForm';
import PhaseTimeline from '../PhaseTimeline';
import ReportingForm from '../forms/ReportingForm';
import FinalizingForm from '../forms/FinalizingForm';
import {
    usePhaseStatus,
    useTodoPhase,
    useTodoPhaseIndex,
} from '../../hooks/use-todo-phase';
import PhaseTimespan from '../PhaseTimespan';

type TabTodoProps = IProps;
const TabTodo = (props: TabTodoProps) => {
    const phases = props.document.state.global.phases;

    const phaseIndex = useTodoPhaseIndex(phases);
    const phase = useTodoPhase(phases);
    const status = usePhaseStatus(phase);

    return (
        <div>
            {phase && status !== 'Invalid' && (
                <>
                    <PhaseTimeline status={status} />

                    <div className="w-full">
                        <div className="isolate -space-y-px rounded-md shadow-sm">
                            <PhaseTimespan phase={phase} />

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
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TabTodo;
