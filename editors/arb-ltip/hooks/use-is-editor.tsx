import { Role } from '../components/UserProvider';
import useRole from './use-role';

const useIsEditor = () => {
    const role = useRole();
    return role === Role.Root || role === Role.Editor;
};

export default useIsEditor;
