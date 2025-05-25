import React from 'react';

interface TimePickerProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ startTime, endTime, onStartTimeChange, onEndTimeChange }) => {
  return (
    <div style={{ backgroundColor: '#C5E3FF', padding: '20px', borderRadius: '10px', color: '#000' }}>
      <h2 style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', fontSize:'40px' }}>Hẹn giờ</h2>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '35px', marginRight: '10px' }}>Từ:</span>
          <input
            type="time"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            style={{
              fontSize: '30px',
              padding: '5px',
              textAlign: 'center',
              borderRadius: '5px',
              marginRight: '20px',
            }}
          />
        </div>
        <div style={{ fontSize: '35px', marginRight: '10px' }}>|</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '35px', marginRight: '10px' }}>Đến:</span>
          <input
            type="time"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            style={{
              fontSize: '30px',
              padding: '5px',
              textAlign: 'center',
              borderRadius: '5px',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TimePicker;