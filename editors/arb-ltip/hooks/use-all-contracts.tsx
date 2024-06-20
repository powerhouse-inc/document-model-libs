import {
    ArbitrumLtipGranteeState,
    findAllContracts,
} from '../../../document-models/arbitrum-ltip-grantee';
import { useMemo } from 'react';

const useAllContracts = (state: ArbitrumLtipGranteeState) => {
    return useMemo(
        () => findAllContracts(state),
        [state.fundingAddress, state.phases],
    );
};

export default useAllContracts;
