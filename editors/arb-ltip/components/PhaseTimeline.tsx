import { classNames } from '../util';

export type PhaseTimelineStatus =
    | 'Invalid'
    | 'Planning'
    | 'Reporting'
    | 'Finalizing';

type StepType = {
    id: string;
    name: string;
    description: string;
    statuses: PhaseTimelineStatus[];
};

const steps: StepType[] = [
    {
        id: '01',
        name: 'Start',
        description: 'Report planned resources.',
        statuses: ['Planning'],
    },
    {
        id: '02',
        name: 'In-progress',
        description: 'Active development.',
        statuses: ['Reporting'],
    },
    {
        id: '03',
        name: 'Finalize',
        description: 'Report actuals and stats.',
        statuses: ['Finalizing'],
    },
];

type PhaseTimelineProps = {
    status: PhaseTimelineStatus;
};
const PhaseTimeline = (props: PhaseTimelineProps) => {
    const { status } = props;

    return (
        <div className="lg:border-b lg:border-t lg:border-gray-200">
            <nav className="mx-auto" aria-label="Progress">
                <ol
                    role="list"
                    className="overflow-hidden rounded-md md:flex lg:rounded-none lg:border-l lg:border-r lg:border-gray-200"
                >
                    {steps.map((step, stepIdx) => {
                        const { id, name, description } = step;

                        return (
                            <li
                                key={step.id}
                                className="relative overflow-hidden lg:flex-1"
                            >
                                <div
                                    className={classNames(
                                        stepIdx === 0
                                            ? 'rounded-t-md border-b-0'
                                            : '',
                                        stepIdx === steps.length - 1
                                            ? 'rounded-b-md border-t-0'
                                            : '',
                                        'overflow-hidden border border-gray-200 lg:border-0',
                                    )}
                                >
                                    {step.statuses.includes(status) ? (
                                        <div>
                                            <span
                                                className="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-gray-200 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                                                aria-hidden="true"
                                            />
                                            <span
                                                className={classNames(
                                                    stepIdx !== 0
                                                        ? 'lg:pl-9'
                                                        : '',
                                                    'flex items-start px-6 py-5 text-sm font-medium',
                                                )}
                                            >
                                                <span className="flex-shrink-0">
                                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600"></span>
                                                </span>
                                                <span className="ml-4 mt-0.5 flex min-w-0 flex-col">
                                                    <span className="text-sm font-medium">
                                                        {name}
                                                    </span>
                                                    <span className="text-xs font-medium">
                                                        {description}
                                                    </span>
                                                </span>
                                            </span>
                                        </div>
                                    ) : (
                                        <div>
                                            <span
                                                className="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-gray-200 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                                                aria-hidden="true"
                                            />
                                            <span
                                                className={classNames(
                                                    stepIdx !== 0
                                                        ? 'lg:pl-9'
                                                        : '',
                                                    'flex items-start px-6 py-5 text-sm font-medium',
                                                )}
                                            >
                                                <span className="flex-shrink-0">
                                                    <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300">
                                                        <span className="text-gray-500">
                                                            {id}
                                                        </span>
                                                    </span>
                                                </span>
                                                <span className="ml-4 mt-0.5 flex min-w-0 flex-col">
                                                    <span className="text-sm font-medium text-gray-500">
                                                        {name}
                                                    </span>
                                                    <span className="text-xs font-medium text-gray-500">
                                                        {description}
                                                    </span>
                                                </span>
                                            </span>
                                        </div>
                                    )}

                                    {stepIdx !== 0 ? (
                                        <>
                                            {/* Separator */}
                                            <div
                                                className="absolute inset-0 left-0 top-0 hidden w-3 lg:block"
                                                aria-hidden="true"
                                            >
                                                <svg
                                                    className="h-full w-full text-gray-300"
                                                    viewBox="0 0 12 82"
                                                    fill="none"
                                                    preserveAspectRatio="none"
                                                >
                                                    <path
                                                        d="M0.5 0V31L10.5 41L0.5 51V82"
                                                        stroke="currentcolor"
                                                        vectorEffect="non-scaling-stroke"
                                                    />
                                                </svg>
                                            </div>
                                        </>
                                    ) : null}
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </div>
    );
};

export default PhaseTimeline;
