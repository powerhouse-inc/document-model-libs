import { useMemo } from 'react';
import { Tooltip } from 'react-tooltip';
import { v4 as uuid } from 'uuid';

const InfoTooltip = ({ text }: { text: string }) => {
    const id = useMemo(() => `info-${uuid()}`, []);

    return (
        <>
            <span
                className="relative border border-2 border-blue-500 rounded-full w-[16px] h-[16px] mx-1 cursor-pointer overflow-visible"
                data-tooltip-id={id}
                data-tooltip-content={text}
            >
                <p className="absolute text-blue-500 text-xs font-bold left-[3px] -top-[3px]">
                    ?
                </p>
            </span>

            <Tooltip id={id} place="top-start" className="z-50" />
        </>
    );
};

export default InfoTooltip;
