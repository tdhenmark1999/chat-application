import styles from './styles.module.css';
import { useState, useEffect, useRef } from 'react';

const Messages = ({ socket, usernameLog }) => {
    const [messagesReceived, setMessagesReceived] = useState([]);
    const messagesColumnRef = useRef(null);

    useEffect(() => {
        socket.on('receive_message', (data) => {
            setMessagesReceived((state) => [
                ...state,
                {
                    message: data.message,
                    username: data.username,
                    __createdtime__: data.__createdtime__,
                },
            ]);
        });

        return () => socket.off('receive_message');
    }, [socket]);

    useEffect(() => {
        socket.on('last_100_messages', (last100Messages) => {
            last100Messages = JSON.parse(last100Messages);
            last100Messages = sortMessagesByDate(last100Messages);
            setMessagesReceived((state) => [...last100Messages, ...state]);
        });

        return () => socket.off('last_100_messages');
    }, [socket]);

    useEffect(() => {
        if (messagesColumnRef.current) {
            messagesColumnRef.current.scrollTop = messagesColumnRef.current.scrollHeight;
        }
    }, [messagesReceived]);

    function sortMessagesByDate(messages) {
        return messages.sort(
            (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
        );
    }

    function formatDateFromTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    return (
        <div className={styles.messagesColumn} ref={messagesColumnRef}>
            {messagesReceived.map((msg, i) => (
                <div className={styles.message} key={i} style={{
                    background: `${msg.username === usernameLog ? 'black' : 'gray'}`,
                }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className={styles.msgMeta}>{msg.username}</span>
                        <span className={styles.msgMeta}>
                            {formatDateFromTimestamp(msg.__createdtime__)}
                        </span>
                    </div>
                    <p className={styles.msgText}>{msg.message}</p>
                    <br />
                </div>
            ))}
        </div>
    );
};

export default Messages;
