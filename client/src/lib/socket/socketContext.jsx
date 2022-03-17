import { createContext } from 'react';
const SocketContext = createContext({
    getSocket: () => null,
    getConnected: () => false,
    getError: () => undefined,
    subscribeEvent: () => undefined,
    getEventMsg: () => ''
});
export default SocketContext;
