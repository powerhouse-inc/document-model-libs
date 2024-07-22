import { useState } from 'react';
import validators from '../../../../document-models/arbitrum-ltip-grantee/src/validators';
import { IProps } from '../../editor';
import { classNames, formatDate, toArray } from '../../util';
import { Phase } from '../../../../document-models/arbitrum-ltip-grantee';
import PhaseSummary from '../PhaseSummary';
import useIsEditor from '../../hooks/use-is-editor';
import EditPhaseForm from '../forms/EditPhaseForm';
import InfoTooltip from '../InfoTooltip';

type DataBadgeProps = {
    isDue: boolean;
    isSubmitted: boolean;
};
const DataBadge = ({ isDue, isSubmitted }: DataBadgeProps) => {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isSubmitted
                    ? 'bg-green-100 text-green-800'
                    : isDue
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
            }`}
        >
            {isSubmitted ? 'Submitted' : isDue ? 'Due' : 'Not Started'}
        </span>
    );
};

type Status = 'Not Started' | 'In Progress' | 'Complete' | 'Overdue';
const statusStyles = {
    'Not Started': 'bg-gray-100 text-gray-800 ring-gray-100',
    'In Progress': 'bg-yellow-100 text-yellow-800 ring-yellow-100',
    Complete: 'bg-green-100 text-green-800 ring-green-100',
    Overdue: 'bg-red-100 text-red-800 ring-red-100',
};

const StatusBadge = ({ status }: { status: Status }) => {
    return (
        <span
            className={classNames(
                statusStyles[status],
                'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
            )}
        >
            {status}
        </span>
    );
};

type TabHistoricalProps = IProps;
const TabHistorical = (props: TabHistoricalProps) => {
    const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
    const [editPhase, setEditPhase] = useState<Phase | null>(null);
    const [editPhaseIndex, setEditPhaseIndex] = useState<number>(-1);
    const phases = toArray(props.document.state.global.phases);

    if (selectedPhase) {
        return (
            <PhaseSummary
                phase={selectedPhase}
                onClose={() => setSelectedPhase(null)}
            />
        );
    }

    if (editPhase) {
        return (
            <EditPhaseForm
                phase={editPhase}
                phaseIndex={editPhaseIndex}
                onCloseForm={() => setEditPhase(null)}
                {...props}
            />
        );
    }

    return (
        <HistoricalTable
            phases={phases}
            setSelectedPhase={setSelectedPhase}
            onEdit={(phase, phaseIndex) => {
                setEditPhase(phase);
                setEditPhaseIndex(phaseIndex);
            }}
        />
    );
};
const HistoricalTable = ({
    phases,
    setSelectedPhase,
    onEdit,
}: {
    phases: Phase[];
    setSelectedPhase: (phase: Phase | null) => void;
    onEdit: (phase: Phase, phaseIndex: number) => void;
}) => {
    const isEditor = useIsEditor();
    return (
        <div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto -mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        <span className="flex items-baseline">
                                            Start Date
                                            <InfoTooltip text="The date the phase starts." />
                                        </span>
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        <span className="flex items-baseline">
                                            Status
                                            <InfoTooltip text="Aggregate status of planned, actuals, and stats statues." />
                                        </span>
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden sm:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        <span className="flex items-baseline">
                                            Planned
                                            <InfoTooltip text="Updates automatically based on planned resource data entry and date." />
                                        </span>
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden sm:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        <span className="flex items-baseline">
                                            Actuals
                                            <InfoTooltip text="Updates automatically based on actuals resource data entry and date." />
                                        </span>
                                    </th>
                                    <th
                                        scope="col"
                                        className="hidden sm:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        <span className="flex items-baseline">
                                            Stats
                                            <InfoTooltip text="Updates automatically based on stats resource data entry and date." />
                                        </span>
                                    </th>
                                    <th
                                        scope="col"
                                        className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                                    >
                                        <span className="sr-only">View</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {phases.map((phase, phaseIndex) => {
                                    const isPhaseStarted =
                                        new Date(phase.startDate) < new Date();
                                    const isPhaseComplete =
                                        new Date(phase.endDate) < new Date();
                                    const isPhaseInProgress =
                                        isPhaseStarted && !isPhaseComplete;
                                    const isPlannedValid =
                                        !!phase.planned &&
                                        validators.isPlannedValid(
                                            phase.planned,
                                        );
                                    const isActualsValid =
                                        !!phase.actuals &&
                                        validators.isActualsValid(
                                            phase.actuals,
                                        );
                                    const isStatsValid =
                                        phase.status === 'Finalized';
                                    let status: Status = 'Not Started';
                                    if (isPhaseInProgress) {
                                        if (isPlannedValid) {
                                            status = 'In Progress';
                                        } else {
                                            status = 'Overdue';
                                        }
                                    } else if (isPhaseComplete) {
                                        if (
                                            isPlannedValid &&
                                            isActualsValid &&
                                            isStatsValid
                                        ) {
                                            status = 'Complete';
                                        } else {
                                            status = 'Overdue';
                                        }
                                    }
                                    return (
                                        <tr
                                            key={phaseIndex}
                                            className={
                                                isPhaseInProgress
                                                    ? 'border-s-8'
                                                    : ''
                                            }
                                        >
                                            <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm pl-0">
                                                <div className="flex items-center">
                                                    <div className="ml-4">
                                                        <div className="font-medium text-gray-900">
                                                            {formatDate(
                                                                phase.startDate,
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                <StatusBadge status={status} />
                                            </td>
                                            <td className="hidden sm:table-cell whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                <DataBadge
                                                    isDue={isPhaseStarted}
                                                    isSubmitted={isPlannedValid}
                                                />
                                            </td>
                                            <td className="hidden sm:table-cell whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                <DataBadge
                                                    isDue={isPhaseComplete}
                                                    isSubmitted={isActualsValid}
                                                />
                                            </td>
                                            <td className="hidden sm:table-cell whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                <DataBadge
                                                    isDue={isPhaseComplete}
                                                    isSubmitted={isStatsValid}
                                                />
                                            </td>
                                            <td className="relative whitespace-nowrap py-5 pl-3 text-right text-sm font-medium flex divide-x">
                                                {isEditor && isPhaseStarted && (
                                                    <p
                                                        className="text-purple-600 hover:text-purple-900 cursor-pointer px-2"
                                                        onClick={() =>
                                                            onEdit(
                                                                phase,
                                                                phaseIndex,
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </p>
                                                )}
                                                <p
                                                    className="text-purple-600 hover:text-purple-900 cursor-pointer px-2"
                                                    onClick={() =>
                                                        setSelectedPhase(phase)
                                                    }
                                                >
                                                    View
                                                </p>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TabHistorical;
