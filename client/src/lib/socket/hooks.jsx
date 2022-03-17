import { useContext, useEffect } from 'react';
import SocketContext from './socketContext';
const useSocket = () => {
    const { getSocket, getConnected, getError } = useContext(SocketContext);
    const socket = getSocket();
    const connected = getConnected();
    const error = getError();
    return { socket, connected, error };
};
const useSocketEvent = (event) => {
    const { subscribeEvent, getEventMsg, getSocket, getConnected } = useContext(SocketContext);
    useEffect(() => {
        subscribeEvent(event);
    });
    const msg = getEventMsg(event);
    const sendMsg = (msgToSend) => {
        var _a;
        (_a = getSocket()) === null || _a === void 0 ? void 0 : _a.emit(event, msgToSend);
    };
    const connected = getConnected();
    return { msg, sendMsg, connected };
};
export { useSocket, useSocketEvent };