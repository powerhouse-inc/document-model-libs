import { useCallback, useMemo, useState } from 'react';
import {
    GranteeStats,
    Phase,
} from '../../../../document-models/arbitrum-ltip-grantee';
import { IProps } from '../../editor';
import { classNames, intHandler } from '../../util';
import validators from '../../../../document-models/arbitrum-ltip-grantee/src/validators';
import { editPhase } from '../../../../document-models/arbitrum-ltip-grantee/gen/creators';
import useInitialScroll from '../../hooks/use-initial-scroll';

type FinalizingFormProps = Pick<IProps, 'context' | 'dispatch'> & {
    phase: Phase;
    phaseIndex: number;
    hideDescription?: boolean;
};
const FinalizingForm = (props: FinalizingFormProps) => {
    const { dispatch, phase, phaseIndex, hideDescription } = props;

    const [showErrors, setShowErrors] = useState(false);
    const [avgDailyTVLLocal, setAvgDailyTVLLocal] = useState(
        phase.stats?.avgDailyTVL || 0,
    );
    const [avgDailyTXNSLocal, setAvgDailyTXNSLocal] = useState(
        phase.stats?.avgDailyTXNS || 0,
    );
    const [avgDailyUniqueUsersLocal, setAvgDailyUniqueUsersLocal] = useState(
        phase.stats?.avgDailyUniqueUsers || 0,
    );
    const [changesLocal, setChangesLocal] = useState(
        phase.stats?.changes || '',
    );
    const [lessonsLocal, setLessonsLocal] = useState(
        phase.stats?.lessons || '',
    );

    const isAvgDailTVLValid = useMemo(
        () => validators.gteZero(avgDailyTVLLocal),
        [avgDailyTVLLocal],
    );
    const isAvgDailyTXNSValid = useMemo(
        () => validators.gteZero(avgDailyTXNSLocal),
        [avgDailyTXNSLocal],
    );
    const isAvgDailyUniqueUsersValid = useMemo(
        () => validators.gteZero(avgDailyUniqueUsersLocal),
        [avgDailyUniqueUsersLocal],
    );
    const isChangesValid = useMemo(
        () => validators.isNotEmptyString(changesLocal),
        [changesLocal],
    );
    const isLessonsValid = useMemo(
        () => validators.isNotEmptyString(lessonsLocal),
        [lessonsLocal],
    );
    const isFormValid =
        isAvgDailTVLValid &&
        isAvgDailyTXNSValid &&
        isAvgDailyUniqueUsersValid &&
        isChangesValid &&
        isLessonsValid;

    useInitialScroll();

    const submit = () => {
        if (
            !isAvgDailTVLValid ||
            !isAvgDailyTXNSValid ||
            !isAvgDailyUniqueUsersValid ||
            !isChangesValid ||
            !isLessonsValid
        ) {
            setShowErrors(true);
            return;
        }

        const stats: GranteeStats = {
            avgDailyTVL: avgDailyTVLLocal,
            avgDailyTXNS: avgDailyTXNSLocal,
            avgDailyUniqueUsers: avgDailyUniqueUsersLocal,
            changes: changesLocal,
            lessons: lessonsLocal,
            kpis: [],
        };
        dispatch(
            editPhase({
                phaseIndex,
                stats,
                status: 'Finalized',
            }),
        );
    };

    const wrapperClasses = useCallback(
        (isValid: boolean) =>
            classNames(
                showErrors && !isValid
                    ? 'ring-4 ring-red-600'
                    : 'ring-1 ring-gray-300',
                'relative rounded-md rounded-b-none rounded-t-none px-3 pb-1.5 pt-2.5 ring-inset focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600',
            ),
        [showErrors],
    );

    return (
        <div className="w-full">
            <div>
                {!hideDescription && (
                    <div className="text-lg px-4 py-4 ring-1 ring-inset ring-gray-300">
                        Please enter statistics for the period from{' '}
                        {new Date(phase.startDate).toDateString()} to{' '}
                        {new Date(phase.endDate).toDateString()}.
                    </div>
                )}
                <div className={wrapperClasses(isAvgDailTVLValid)}>
                    <label className="block text-xs font-medium text-gray-900">
                        Average Daily TVL (required)
                    </label>
                    <input
                        type="text"
                        className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Enter amount"
                        value={avgDailyTVLLocal}
                        onChange={intHandler(setAvgDailyTVLLocal)}
                    />
                </div>
                <div className={wrapperClasses(isAvgDailTVLValid)}>
                    <label className="block text-xs font-medium text-gray-900">
                        Average Daily Transactions (required)
                    </label>
                    <input
                        type="text"
                        className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Enter amount"
                        value={avgDailyTXNSLocal}
                        onChange={intHandler(setAvgDailyTXNSLocal)}
                    />
                </div>
                <div className={wrapperClasses(isAvgDailyUniqueUsersValid)}>
                    <label className="block text-xs font-medium text-gray-900">
                        Average Daily Unique Users (required)
                    </label>
                    <input
                        type="text"
                        className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Enter amount"
                        value={avgDailyUniqueUsersLocal}
                        onChange={intHandler(setAvgDailyUniqueUsersLocal)}
                    />
                </div>
                <div className={wrapperClasses(isChangesValid)}>
                    <label className="block text-xs font-medium text-gray-900">
                        Changes
                    </label>
                    <textarea
                        className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Meaningful changes applied during the biweekly period"
                        value={changesLocal}
                        onChange={e => setChangesLocal(e.target.value)}
                    />
                </div>
                <div className={wrapperClasses(isLessonsValid)}>
                    <label className="block text-xs font-medium text-gray-900">
                        Lessons
                    </label>
                    <textarea
                        className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Lessons learned over the last 2 weeks"
                        value={lessonsLocal}
                        onChange={e => setLessonsLocal(e.target.value)}
                    />
                </div>
            </div>
            <button
                type="button"
                className={classNames(
                    isFormValid
                        ? 'hover:bg-purple-700'
                        : 'hover:animate-shake hover:bg-red-500',
                    'inline-flex items-center mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 disabled:bg-slate-100',
                )}
                onClick={submit}
            >
                Submit
            </button>
        </div>
    );
};

export default FinalizingForm;
