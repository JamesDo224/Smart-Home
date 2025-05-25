import React, { useState, useEffect } from 'react';
import lightIcon from '../assets/light.png';
import curtainIcon from '../assets/curtain.png';
import windowIcon from '../assets/window.png';
import clockIcon from '../assets/clock.png';
import FireIcon from '../assets/fire_detection.png';
import Sidebar from '../components/sidebar';
import { toggleMotor } from '../services/toggleMotorApi';
import { toggleLight } from '../services/toggleLightApi';
import { toggleServo } from '../services/toggleServoApi';
import { turnOffFireAlarm } from '../services/toggleFireDetectionApi';
import { useNavigate } from 'react-router-dom';
import styles from './operations.module.css'; // Import file CSS nếu tách riêng
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
interface ToggleSwitchProps {
    label: React.ReactNode; // Sửa từ string sang React.ReactNode để hỗ trợ JSX
    checked: boolean;
    onChange: (checked: boolean) => void;
}

// Component ToggleSwitch để tạo nút bật/tắt
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, checked, onChange }) => {
    return (
        <div className={styles['toggle-container']}>
            <span>{label}</span>
            <label className={styles.switch}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <span className={`${styles.slider} ${styles.round}`}></span>
            </label>
        </div>
    );
};

const Operation: React.FC = () => {
    // State cho các nút bật/tắt
    const [denPhong, setDenPhong] = useState(false);
    const [remCua, setRemCua] = useState(false);
    const [cuaSo, setCuaSo] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [fireAlarm, setFireAlarm] = useState(false);
    // State chứa dữ liệu cảm biến nhận từ websocket
    const [sensorData, setSensorData] = useState({
        temperature: 0,
        humidity: 0,
        light: 0,
        airQuality: 0,
    });
    const navigate = useNavigate();

    // Kết nối WebSocket để nhận dữ liệu cảm biến thời gian thực
    useEffect(() => {
        const ws = new WebSocket('wss://iot-project-y7dx.onrender.com/ws/data');

        ws.onopen = () => {
            console.log('Connected to WebSocket');
        };

        ws.onmessage = (event) => {
            // Dữ liệu nhận về dạng JSON: {"temperature":3.14,"humidity":60.3,"light":70,"airQuality":0.0}
            const sensor = JSON.parse(event.data);
            console.log('Received sensor data:', sensor);
            setSensorData(sensor);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            ws.close();
        };
    }, []);
    useEffect(() => {
        const fetchDeviceStates = async () => {
            try {
                const accessToken = localStorage.getItem('token');
                const headers = {
                    'Authorization': `Bearer ${accessToken}`,
                };

                // Fetch all device states
                const [lightResponse, motorResponse, servoResponse, fire_detection] = await Promise.all([
                    fetch('https://iot-project-y7dx.onrender.com/api/v1/device/state/set-elight', { headers }),
                    fetch('https://iot-project-y7dx.onrender.com/api/v1/device/state/set-emotor', { headers }),
                    fetch('https://iot-project-y7dx.onrender.com/api/v1/device/state/set-servo', { headers }),
                    fetch('https://iot-project-y7dx.onrender.com/api/v1/device/state/fire-detection', { headers })
                ]);

                const [lightData, motorData, servoData, fire_detectionData] = await Promise.all([
                    lightResponse.json(),
                    motorResponse.json(),
                    servoResponse.json(),
                    fire_detection.json()
                ]);

                setDenPhong(lightData.data === 1);
                setRemCua(motorData.data === 1);
                setCuaSo(servoData.data === 1);
                setFireAlarm(fire_detectionData.data === 1);
            } catch (error) {
                console.error('Error fetching device states:', error);
                toast.error('Không thể lấy trạng thái thiết bị');
            } finally {
                setInitialLoading(false); // Turn off initial loading after first fetch
            }
        };

        fetchDeviceStates();
        const interval = setInterval(fetchDeviceStates, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleToggleLight = async (checked: boolean) => {
        try {
          // Call the API to toggle the light. Assume it returns a promise.
          await toggleLight();
          setDenPhong(checked);
        } catch (error) {
          console.error("Error toggling light:", error);
          // Optionally show error feedback to the user.
        }
      };
    const handleToggleMotor = async (checked: boolean) => {
        try {
          // Call the API to toggle the light. Assume it returns a promise.
          await toggleMotor();
          setRemCua(checked);
        } catch (error) {

        }
      };
    
    const handleToggleServo = async (checked: boolean) => {
        try {
          // Call the API to toggle the light. Assume it returns a promise.
          await toggleServo();
          setCuaSo(checked);
        } catch (error) {

        }
    };
    const handleToggleFireAlarm = async (checked: boolean) => {
        try {
            await turnOffFireAlarm();
            setFireAlarm(checked);        } 
            catch (error) {
            console.error("Error turning off fire alarm:", error);
            }
    }

    // Xử lý khi bấm vào nút Cài đặt hẹn giờ
    const handleHenGioClick = () => {
        // Ví dụ: điều hướng sang trang hẹn giờ (nếu đã có route "/hen-gio")
        // navigate('/hen-gio');
        navigate('/timerpage'); // Chuyển sang trang hẹn giờ (timer)
        // Hoặc tạm thời chỉ in ra console
        console.log("Chuyển qua giao diện cài đặt hẹn giờ (chưa hiện thực)");
    };

    return (
        <div className={styles['container-operation']}>
            {/* Bên trái: Thông tin Chất lượng không khí */}
            {initialLoading && <Loader />} {/* Hiển thị Loader khi đang tải dữ liệu */}
            <Sidebar isLogin = {true}/>
            <div className={styles['left-panel']}>
                <h2>Chất lượng</h2>
                <h2>không khí</h2>
                <div className={styles.cards}>
                    <div className={styles.card}>
                        <div className={styles.icon}>🌡️</div>
                        <div className={styles.info}>
                            <span>Nhiệt độ</span>
                            <span className={styles.value}>{sensorData.temperature}°C</span>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.icon}>💧</div>
                        <div className={styles.info}>
                            <span>Độ ẩm</span>
                            <span className={styles.value}>{sensorData.humidity}%</span>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.icon}>☀️</div>
                        <div className={styles.info}>
                            <span>Ánh sáng</span>
                            <span className={styles.value}>{sensorData.light} lux</span>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles['co2-icon']}>CO₂</div>
                        <div className={styles.info}>
                            <span>Nồng độ CO₂</span>
                            <span className={styles.value}>{sensorData.airQuality}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bên phải: Trợ năng */}
            <div className={styles['right-panel']}>
                <h3>Trợ năng</h3>
                <ToggleSwitch
                    label={
                        <div className={styles['label-container']}>
                            <img
                                src={lightIcon}
                                alt="Light"
                                style={{ width: '50px', height: '50px', marginRight: '10px' }}
                            />
                            <span>Đèn phòng</span>
                        </div>
                    }
                    checked={denPhong}
                    onChange={handleToggleLight}
                />
                <ToggleSwitch label={
                    <div className={styles['label-container']}>
                        <img
                            src={curtainIcon}
                            alt="Curtain"
                            style={{ width: '50px', height: '50px', marginRight: '10px' }}
                        />
                        <span>Rèm cửa</span>
                    </div>
                }
                    checked={remCua}
                    onChange={handleToggleMotor}
                />
                <ToggleSwitch label={
                    <div className={styles['label-container']}>
                        <img
                            src={windowIcon}
                            alt="Window"
                            style={{ width: '50px', height: '50px', marginRight: '10px' }}
                        />
                        <span>Cửa sổ</span>
                    </div>
                }
                    checked={cuaSo}
                    onChange={handleToggleServo}
                />
                <ToggleSwitch label={
                    <div className={styles['label-container']}>
                        <img
                            src={FireIcon}
                            alt="Fire Alarm"
                            style={{ width: '50px', height: '50px', marginRight: '10px' }}
                        />
                        <span>Hệ thống báo cháy</span>
                    </div>
                }
                    checked={fireAlarm}
                    onChange={handleToggleFireAlarm}
                />

                {/* Nút Cài đặt hẹn giờ (dấu +) */}
                <div className={styles['hen-gio-container']}>
                    <div className={styles['label-container']}>
                        <img
                            src={clockIcon}
                            alt="Clock"
                            style={{ width: '50px', height: '50px', marginRight: '10px' }}
                        />
                        <span>Cài đặt hẹn giờ</span>
                    </div>
                    <button className={styles['hen-gio-button']} onClick={handleHenGioClick}>
                        +
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Operation;
