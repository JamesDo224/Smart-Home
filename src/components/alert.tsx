// src/components/FireAlert.tsx
import React, { useState } from "react";
import styles from './alert.module.css'; // Import CSS module
import { turnOffFireAlarm } from '../services/toggleFireDetectionApi'; // Import API service
interface AlertProps {
  value: number;   // Giá trị (nhiệt độ hoặc độ ẩm)
  message: string; // Thông điệp cảnh báo
  type: 'temperature' | 'humidity' | 'light' | 'airpollution';
}

const Alert: React.FC<AlertProps> = ({ value, message, type }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };
  


  if (!isOpen) return null; // Không render modal nếu isOpen là false
  const unit = type === 'humidity' ? '%' : type === 'light' ? 'cd' : type === 'airpollution' ? 'µg/m³' : '°C';  // Đơn vị cho ô nhiễm không khí
  
  // Đổi lớp modal dựa trên type (nhiệt độ, độ ẩm, cường độ ánh sáng hoặc ô nhiễm không khí)
  const modalClass = type === 'humidity' ? `${styles.modal} ${styles.humidity}` :
                      type === 'light' ? `${styles.modal} ${styles.light}` :
                      type === 'airpollution' ? `${styles.modal} ${styles.airpollution}` : 
                      `${styles.modal} ${styles.temperature}`;

  const handleTempAction = async() => {
    try {
      await turnOffFireAlarm();
      handleClose();
    } catch (error) {
      console.error("Error turning off fire alarm:", error);
      // Optionally show error feedback to the user.
    }
  };
  return (
    <div className={styles.modalOverlay}>
      <div className={modalClass}>
        <span className={styles.closeButton} onClick={handleClose}>×</span>
        <div className={styles.temperature}>{value}{unit}</div>
        <div className={styles.messageWrapper}>
          <div className={styles.message}>{message}</div>
        </div>
        {type === "temperature" && (
          <button className={styles.tempButton} onClick={handleTempAction}>
            Tắt hệ thống báo cháy
          </button>
        )}
        <div className={styles.fireBackground}></div>
      </div>
    </div>
  );
};

export default Alert;
