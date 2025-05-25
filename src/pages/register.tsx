import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/home.svg';
import styles from './login.module.css';

const Register = () => {
    const [reveal, setReveal] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
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
            const res = await fetch('https://iot-project-y7dx.onrender.com/api/v1/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, fullName, email, phone, address }),
            });
            const body = await res.json();
            if (res.ok && body.status === 200) {
                navigate('/login');
            } else {
                setError(body.message || 'Đăng ký thất bại');
            }
        } catch {
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
                            placeholder="Thiết lập mật khẩu"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            className={styles.loginInput}
                            id="fullName"
                            type="fullName"
                            placeholder="Họ và tên"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            className={styles.loginInput}
                            id="email"
                            type="email"
                            placeholder="Nhập Email của bạn"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            className={styles.loginInput}
                            id="phone"
                            type="phone"
                            placeholder="Số điện thoại"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            className={styles.loginInput}
                            id="address"
                            type="address"
                            placeholder="Nhập địa chỉ"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            required
                        />
                    </div>


                    {error && <p className={styles.errorMsg}>{error}</p>}

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng ký' : 'Đăng ký'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
