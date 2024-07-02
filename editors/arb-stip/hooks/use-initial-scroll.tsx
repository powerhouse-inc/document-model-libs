import { useEffect } from 'react';

const useInitialScroll = () => {
    useEffect(() => window.scrollTo(0, 0), []);
};

export default useInitialScroll;
