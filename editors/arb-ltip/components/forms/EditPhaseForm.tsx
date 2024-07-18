import { Phase } from 'document-models/arbitrum-ltip-grantee';
import PlannedResourcesForm from './PlannedResourcesForm';
import ReportingForm from './ReportingForm';
import FinalizingForm from './FinalizingForm';
import { IProps } from 'editors/arb-ltip/editor';
import { Icon } from '@powerhousedao/design-system';

type EditPhaseFormProps = IProps & {
    phase: Phase;
    phaseIndex: number;
    onCloseForm: () => void;
};

const EditPhaseForm = ({
    phase,
    phaseIndex,
    onCloseForm,
    ...props
}: EditPhaseFormProps) => {
    const state = props.document.state.global;

    const isPhaseStarted = new Date(phase.startDate) < new Date();
    const isPhaseComplete = new Date(phase.endDate) < new Date();

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex pt-4">
                <Icon
                    className="cursor-pointer"
                    name="base-arrow-left"
                    onClick={onCloseForm}
                />
                <span className="cursor-pointer" onClick={onCloseForm}>
                    Back
                </span>
            </div>
            <div className="p-4 ring-2 ring-gray-300">
                <p className="text-lg font-bold">Planned Resources</p>
                <PlannedResourcesForm
                    phase={phase}
                    phaseIndex={phaseIndex}
                    state={state}
                    {...props}
                    hideDescription
                />
            </div>
            {isPhaseStarted && (
                <div className="p-4 ring-2 ring-gray-300">
                    <p className="text-lg font-bold">Actual Resources</p>
                    <ReportingForm
                        phase={phase}
                        phaseIndex={phaseIndex}
                        state={state}
                        {...props}
                        hideDescription
                    />
                </div>
            )}
            {isPhaseComplete && (
                <div className="p-4 ring-2 ring-gray-300">
                    <p className="text-lg font-bold">Final Reporting</p>
                    <FinalizingForm
                        phase={phase}
                        phaseIndex={phaseIndex}
                        {...props}
                        hideDescription
                    />
                </div>
            )}
            <div className="h-4" />
        </div>
    );
};

export default EditPhaseForm;
