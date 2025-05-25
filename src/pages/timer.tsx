import React, { useState } from 'react';
import Tabs from '../components/tab';
import ToggleList from '../components/togglelist';
import TimeSlotList from '../components/timeslotlist';
import Sidebar from '../components/sidebar';
import TimePicker from '../components/timepicker';
import styles from './timer.module.css';
import { scheduleDevice } from '../services/scheduleApi';
import { toast } from 'react-toastify';
const TimerPage: React.FC = () => {
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  // Change selectedToggleIds to string[] so that they directly represent device IDs from ToggleList.
  const [selectedToggleIds, setSelectedToggleIds] = useState<string[]>([]);
  const [refreshToggleList, setRefreshToggleList] = useState(false);
  const [refreshTimeSlotList, setRefreshTimeSlotList] = useState(false);
  const handleConfirmSchedule = async () => {
    if (selectedDays.length === 0) {
      toast.error('Vui lòng chọn ít nhất một ngày trong tuần!');
      return;
    }
    if (selectedToggleIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất một thiết bị!');
      return;
    }
    if (!startTime || !endTime) {
      toast.error('Vui lòng chọn thời gian bắt đầu và kết thúc!');
      return;
    }
    if (startTime >= endTime) {
      toast.error('Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!');
      return;
    }
    try {
      const schedule = {
        mon: selectedDays.includes("T2"),
        tue: selectedDays.includes("T3"),
        wed: selectedDays.includes("T4"),
        thu: selectedDays.includes("T5"),
        fri: selectedDays.includes("T6"),
        sat: selectedDays.includes("T7"),
        sun: selectedDays.includes("CN"),
        from: startTime,
        to: endTime,
      };

      // For each device ID obtained from the ToggleList, call the schedule API.
      for (const deviceId of selectedToggleIds) {
        const result = await scheduleDevice(deviceId, schedule);
        console.log(`Schedule set successfully for device ${deviceId}:`, result);
      }
      setSelectedToggleIds([]);
      setSelectedDays([]);
      setStartTime('05:00');
      setEndTime('05:30');
      setRefreshToggleList(prev => !prev); // Toggle to trigger refresh
      setRefreshTimeSlotList(prev => !prev);
      toast.success('Thêm lịch trình thành công!');
    } catch (error) {
      console.error('Error scheduling device:', error);
    }
  };

  return (
    <div className={styles.timerPage}>
      <Sidebar isLogin={true} />
      <div className={styles.mainContent}>
        <div className={styles.timerSection}>
          <div className={styles.leftSection}>
            <div className={styles.timeslotListHeader}>Danh sách hẹn giờ</div>
            <div className={styles.timeslot}>
            <TimeSlotList refreshTrigger={refreshTimeSlotList} />
            </div>
          </div>
          <div className={styles.rightSection}>
            <div className={styles.timePickerWrapper}>
              <TimePicker 
                startTime={startTime}
                endTime={endTime}
                onStartTimeChange={setStartTime}
                onEndTimeChange={setEndTime}
              />
            </div>
            <div className={styles.tabWrapper}>
              <div className={styles.labelText}>Lặp lại</div>
              <div className={styles.resizableTabs}>
                <Tabs selectedTabs={selectedDays} onChange={setSelectedDays} />
              </div>
            </div>
            <div className={styles.toggleList}>
              {/* Pass onChange callback to capture the selected device IDs from ToggleList */}
              <ToggleList 
                onChange={setSelectedToggleIds} 
                refreshTrigger={refreshToggleList} 
              />
            </div>
            <div className={styles.confirmButtonWrapper}>
              <button className={styles.confirmButton} onClick={handleConfirmSchedule}>
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerPage;