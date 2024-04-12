import { Dialog, Transition } from '@headlessui/react';
import { Phase } from '../../../document-models/arb-ltip-grantee';
import PhaseTimespan from './PhaseTimespan';
import PhasePlanned from './PhasePlanned';
import PhaseActuals from './PhaseActuals';
import PhaseStats from './PhaseStats';
import { Fragment } from 'react';

type PhaseSummaryModalProps = {
    phase: Phase | null;
    isOpen: boolean;
    onClose: () => void;
};
const PhaseSummaryModal = ({
    phase,
    isOpen,
    onClose,
}: PhaseSummaryModalProps) => {
    if (!phase) {
        return null;
    }

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4"
                            enterTo="opacity-100 translate-y-0"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-4"
                        >
                            <Dialog.Panel
                                style={{ width: '480px' }}
                                className=""
                            >
                                <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all my-8">
                                    <div className="mt-4">
                                        <PhaseTimespan phase={phase} />
                                        <PhasePlanned phase={phase} />
                                        <PhaseActuals phase={phase} />
                                        <PhaseStats phase={phase} />
                                    </div>
                                    <div className="mt-5"></div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default PhaseSummaryModal;
