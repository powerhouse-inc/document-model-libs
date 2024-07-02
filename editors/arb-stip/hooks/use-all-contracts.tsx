import {
    ArbitrumStipGranteeState,
    findAllContracts,
} from '../../../document-models/arbitrum-stip-grantee';
import { useMemo } from 'react';

const useAllContracts = (state: ArbitrumStipGranteeState) => {
    return useMemo(
        () => findAllContracts(state),
        [state.fundingAddress, state.phases],
    );
};

export default useAllContracts;
