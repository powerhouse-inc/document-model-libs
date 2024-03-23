import { Phase } from '../../../document-models/arb-ltip-grantee';

const PhaseTimespan = ({ phase: { startDate, endDate } }: { phase: Phase }) => (
    <div className="relative rounded-md !rounded-t-none !rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600 flex">
        <div className="flex-1" />
        <div>
            <label className="block text-xs font-medium text-gray-900">
                Start Date
            </label>
            <p>{new Date(startDate).toDateString()}</p>
        </div>
        <p className="text-3xl px-16">→</p>
        <div>
            <label className="block text-xs font-medium text-gray-900">
                End Date
            </label>
            <p>{new Date(endDate).toDateString()}</p>
        </div>
        <div className="flex-1" />
    </div>
);

export default PhaseTimespan;
