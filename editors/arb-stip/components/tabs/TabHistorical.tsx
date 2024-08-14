import { useMemo, useState } from 'react';
import validators from '../../../../document-models/arbitrum-stip-grantee/src/validators';
import { IProps } from '../../editor';
import { classNames, formatDate, toArray } from '../../util';
import { Phase } from '../../../../document-models/arbitrum-stip-grantee';
import PhaseSummary from '../PhaseSummary';
import useIsEditor from '../../hooks/use-is-editor';
import EditPhaseForm from '../forms/EditPhaseForm';

import InfoTooltip from '../../../arb-ltip/components/InfoTooltip';
import { v4 as uuid } from 'uuid';
import { Tooltip } from 'react-tooltip';
import { correctPhases } from '../../../arb-ltip/util';

type DataBadgeProps = {
    isDue: boolean;
    isSubmitted: boolean;
    tooltip: string;
};
const DataBadge = ({ isDue, isSubmitted, tooltip }: DataBadgeProps) => {
    const id = useMemo(() => `info-${uuid()}`, []);

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                isSubmitted
                    ? 'bg-green-100 text-green-800'
                    : isDue
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
            }`}
            data-tooltip-id={id}
            data-tooltip-content={tooltip}
        >
            {isSubmitted ? 'Submitted' : isDue ? 'Due' : 'Not Started'}

            {isDue && !isSubmitted && (
                <Tooltip id={id} place="top-start" className="z-50" />
            )}
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

const StatusBadge = ({
    status,
    tooltip,
}: {
    status: Status;
    tooltip: string;
}) => {
    const id = useMemo(() => `info-${uuid()}`, []);

    return (
        <>
            <span
                className={classNames(
                    statusStyles[status],
                    'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset cursor-pointer',
                )}
                data-tooltip-id={id}
                data-tooltip-content={tooltip}
            >
                {status}
            </span>

            {tooltip && <Tooltip id={id} place="top-start" className="z-50" />}
        </>
    );
};

type TabHistoricalProps = IProps;
const TabHistorical = (props: TabHistoricalProps) => {
    const [selectedPhase, setSelectedPhase] = useState<number>(-1);
    const [editPhase, setEditPhase] = useState<Phase | null>(null);
    const [editPhaseIndex, setEditPhaseIndex] = useState<number>(-1);
    const phases = correctPhases(props.document.state.global.phases);
    const title = props.document.state.global.granteeName;

    if (selectedPhase > -1) {
        return (
            <PhaseSummary
                state={props.document.state.global}
                phaseIndex={selectedPhase}
                onClose={() => setSelectedPhase(-1)}
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
            title={title || 'Historical Phases'}
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
    title,
    phases,
    setSelectedPhase,
    onEdit,
}: {
    title: string;
    phases: Phase[];
    setSelectedPhase: (phase: number) => void;
    onEdit: (phase: Phase, phaseIndex: number) => void;
}) => {
    const isEditor = useIsEditor();
    return (
        <div>
            <div className="flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto -mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle px-6 lg:px-8">
                        <p className="flex-1 mt-3 font-semibold text-4xl text-gray-900 truncate">
                            {title}
                        </p>
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

                                    let statusTooltip = '';
                                    if (status === 'Not Started') {
                                        statusTooltip = `Phase starts on ${formatDate(phase.startDate)}.`;
                                    } else if (status === 'In Progress') {
                                        statusTooltip = `Phase started on ${formatDate(phase.startDate)}.`;
                                    } else if (status === 'Complete') {
                                        statusTooltip = `Phase completed on ${formatDate(phase.endDate)}.`;
                                    } else if (status === 'Overdue') {
                                        statusTooltip = `One or more reports are overdue.`;
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
                                                <StatusBadge
                                                    status={status}
                                                    tooltip={statusTooltip}
                                                />
                                            </td>
                                            <td className="hidden sm:table-cell whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                <DataBadge
                                                    isDue={isPhaseStarted}
                                                    isSubmitted={isPlannedValid}
                                                    tooltip={`Planned resources were due on ${formatDate(phase.startDate)}.`}
                                                />
                                            </td>
                                            <td className="hidden sm:table-cell whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                <DataBadge
                                                    isDue={isPhaseComplete}
                                                    isSubmitted={isActualsValid}
                                                    tooltip={`Actuals were due on ${formatDate(phase.endDate)}.`}
                                                />
                                            </td>
                                            <td className="hidden sm:table-cell whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                <DataBadge
                                                    isDue={isPhaseComplete}
                                                    isSubmitted={isStatsValid}
                                                    tooltip={`Stats were due on ${formatDate(phase.endDate)}.`}
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
                                                        setSelectedPhase(
                                                            phaseIndex,
                                                        )
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
