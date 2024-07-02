import { useContext } from 'react';
import { UserContext } from '../components/UserProvider';

const useAddress = () => {
    const context = useContext(UserContext);
    return context.user?.address;
};

export default useAddress;
