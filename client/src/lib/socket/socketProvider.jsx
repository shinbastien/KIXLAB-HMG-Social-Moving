import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import SocketContext from './socketContext';
SocketProvider.defaultProps = {
    options: null
};
function SocketProvider({ url, children, options }) {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    const [eventMsgRecord, setEventMsgRecord] = useState({});
    useEffect(() => {
        const newSocket = io(url, options);
        setSocket(newSocket);
        console.log('Socket Created');
        newSocket.on('connect', () => {
            setConnected(true);
        });
        newSocket.on('disconnect', () => {
            console.log('socket disconnected');
            newSocket.removeAllListeners();
            setConnected(false);
        });
        newSocket.on('error', err => {
            setError(err);
        });
        return () => {
            setSocket(null);
            console.log('socket disconnect');
            newSocket.disconnect();
        };
    }, [url, options]);
    const getSocket = () => socket;
    const getConnected = () => connected;
    const getError = () => error;
    const setEventMsg = (event, msg) => {
        setEventMsgRecord(Object.assign(Object.assign({}, eventMsgRecord), { [event]: msg }));
    };
    const subscribeEvent = (event) => {
        socket === null || socket === void 0 ? void 0 : socket.on(event, (msg) => {
            setEventMsg(event, msg);
        });
    };
    const getEventMsg = (event) => eventMsgRecord[event];
    return (React.createElement(SocketContext.Provider, { value: {
            getSocket,
            getConnected,
            getError,
            subscribeEvent,
            getEventMsg
        } }, children));
}
export default SocketProvider;