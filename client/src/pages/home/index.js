import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';

const Home = ({ username, setUsername, room, setRoom, socket }) => {
    const navigate = useNavigate();

    const joinRoom = () => {
        if (room !== '' && username !== '') {
            socket.emit('join_room', { username, room });
        }

        navigate('/chat', { replace: true });
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h1 className={styles.loginTitle}>{`</>Channel Group</>`}</h1>
                <input className={styles.input} placeholder='Username...' onChange={(e) => setUsername(e.target.value)} />

                <select className={styles.input} onChange={(e) => setRoom(e.target.value)}>
                    <option>-- Select Room --</option>
                    <option value='general'>General</option>
                    <option value='development'>Development Team</option>
                    <option value='finance'>Finance Team</option>
                    <option value='head team'>Head Team</option>
                </select>

                <button
                    className='btn btn-primary'
                    style={{ width: '100%' }}
                    onClick={joinRoom}
                >
                    Join Room
                </button>
            </div>
        </div>
    );
};

export default Home;