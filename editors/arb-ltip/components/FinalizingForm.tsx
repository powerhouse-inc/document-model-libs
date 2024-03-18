import { Phase } from '../../../document-models/arb-ltip-grantee';
import { IProps } from '../editor';

type FinalizingFormProps = Pick<IProps, 'editorContext' | 'dispatch'> & {
    phase: Phase;
    phaseIndex: number;
};
const FinalizingForm = (props: FinalizingFormProps) => {
    const { dispatch, phase } = props;

    return <div></div>;
};

export default FinalizingForm;
