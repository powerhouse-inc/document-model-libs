import { IProps } from '../editor';
import PhaseStartForm from './PhaseStartForm';
import PhaseTimeline from './PhaseTimeline';

type PhaseDisplayProps = Pick<IProps, 'editorContext' | 'dispatch'>;
const PhaseDisplay = (props: PhaseDisplayProps) => {
    return (
        <div>
            <PhaseTimeline />
            <PhaseStartForm {...props} />
        </div>
    );
};

export default PhaseDisplay;
