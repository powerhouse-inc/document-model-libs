import { Role } from '../components/UserProvider';
import useRole from './use-role';

const useIsAdmin = () => useRole() === Role.Root;

export default useIsAdmin;
