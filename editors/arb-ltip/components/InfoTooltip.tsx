import { useMemo } from 'react';
import { Tooltip } from 'react-tooltip';
import { v4 as uuid } from 'uuid';

/**
 * From https://www.iconfinder.com/icons/9040333/info_circle_icon with permission.
 *
 * License: MIT (https://opensource.org/license/MIT)
 */
const InfoIcon = () => (
    <svg
        className="w-[12px]"
        fill="#888888"
        height="16"
        viewBox="0 0 16 16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
    </svg>
);

const InfoTooltip = ({ text }: { text: string }) => {
    const id = useMemo(() => `info-${uuid()}`, []);

    return (
        <>
            <span
                className="relative w-[12px] h-[12px] mx-1 cursor-pointer"
                data-tooltip-id={id}
                data-tooltip-content={text}
            >
                <InfoIcon />
            </span>

            <Tooltip id={id} place="top-start" className="z-50" />
        </>
    );
};

export default InfoTooltip;
