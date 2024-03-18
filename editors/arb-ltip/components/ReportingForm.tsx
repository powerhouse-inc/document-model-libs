import { Phase } from '../../../document-models/arb-ltip-grantee';
import { IProps } from '../editor';

type ReportingFormProps = Pick<IProps, 'editorContext' | 'dispatch'> & {
    phase: Phase;
    phaseIndex: number;
};
const ReportingForm = (props: ReportingFormProps) => {
    const { dispatch, phase } = props;

    return <div></div>;
};

export default ReportingForm;
