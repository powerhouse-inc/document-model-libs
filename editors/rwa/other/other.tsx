import { IProps } from '../editor';
import { Accounts } from './accounts';
import { FixedIncomeTypes } from './fixed-income-types';
import { ServiceProviderFeeTypes } from './service-provider-fee-types';
import { SPVs } from './spvs';

export const Other = (props: IProps) => {
    return (
        <div>
            <Accounts {...props} />
            <FixedIncomeTypes {...props} />
            <SPVs {...props} />
            <ServiceProviderFeeTypes {...props} />
        </div>
    );
};
