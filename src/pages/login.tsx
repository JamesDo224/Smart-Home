import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/home.svg';
import userIcon from '../assets/Flat.svg';
import styles from './login.module.css';

const Login = () => {
    const [reveal, setReveal] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Delay tí để transition nhìn tự nhiên hơn
        const timer = setTimeout(() => setReveal(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch('https://iot-project-y7dx.onrender.com/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const body = await res.json();

            if (!res.ok || body.status !== 200) {
                setError(body.message || 'Login failed');
            } else {
                const { token, expirationTime } = body.data;
                localStorage.setItem('token', token);
                localStorage.setItem('tokenExpiry', expirationTime);
                navigate('/');
            }
        } catch (err) {
            setError('Network error, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`${styles.container} ${reveal ? styles.reveal : ''}`}>
            <div className={styles.bgSlide} />

            <div className={styles.imageContainer}>
                <img src={homeIcon} alt="Smart Home" className={styles.homeImage} />
            </div>

            <div className={styles.formContainer}>
                <form onSubmit={handleSubmit} >
                    <div >
                        <img src={userIcon} alt="User Login" className={styles.userIcon} />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            className={styles.loginInput}
                            id="username"
                            type="text"
                            placeholder="Nhập UserName"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            className={styles.loginInput}
                            id="password"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className={styles.errorMsg}>{error}</p>}

                    <div className={styles.buttonGroup}>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Đang đăng nhập' : 'Đăng nhập'}
                        </button>
                        <button className={styles.submitButton} onClick={() => navigate('/register')}>
                            Chưa có tài khoản?
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
