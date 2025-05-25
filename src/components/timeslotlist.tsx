import React, { useState, useEffect } from 'react';
import { fetchDeviceSchedule } from '../services/getAllSchedule';
import styles from './timeslotlist.module.css';
import DeleteButton from './deletebutton';
import Loader from '../components/loading';
import  deleteSchedule  from '../services/deleteSchedule';
interface Device {
  id: number;
  name: string;
  feedName: string;  // Changed from seedName to feedName
}

interface Schedule {
  id: number;
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  sun: boolean;
  from: string;
  to: string;
  device: Device;
}

type TimeSlotProps = {
  startTime?: string;
  endTime?: string;
  days?: string;
  devices?: string[];
  onDelete?: () => void;
};

const TimeSlot: React.FC<TimeSlotProps> = ({
  startTime = '',
  endTime = '',
  days = '',
  devices = [],
  onDelete,
}) => {
  return (
    <div className={styles.timeSlot}>
      <div className={styles.mainContent}>
        <div className={styles.timeContainer}>
          <div className={styles.timeLeft}>{startTime}</div>
          <div className={styles.timeRight}>{endTime}</div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.detailsAndDevices}>
            <div className={styles.details}>{days}</div>
            <div className={styles.devices}>
              {devices.map((device, index) => (
                <span key={index}>
                  {device}
                  {index < devices.length - 1 && ' | '}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {onDelete && (
        <div className={styles.deleteButtonContainer}>
          <DeleteButton onClick={onDelete} />
        </div>
      )}
    </div>
  );
};

const convertDaysToText = (schedule: Schedule): string => {
  const dayMap: { [key: string]: string } = {
    mon: 'T2',
    tue: 'T3',
    wed: 'T4',
    thu: 'T5',
    fri: 'T6',
    sat: 'T7',
    sun: 'CN'
  };

  return Object.entries(dayMap)
    .filter(([key]) => schedule[key as keyof Schedule])
    .map(([_, value]) => value)
    .join(', ');
};

interface TimeSlotListProps {
  refreshTrigger?: any; // Define the type of refreshTrigger if needed
}

const TimeSlotList: React.FC<TimeSlotListProps> = ({refreshTrigger}) => {
  const [timeSlots, setTimeSlots] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const deviceId = 1; // Replace with actual device ID

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch schedules for devices 1-3
        const deviceIds = [1, 2, 3];
        const allSchedules = await Promise.all(
          deviceIds.map(id => fetchDeviceSchedule(id))
        );
        
        // Combine all schedules into a single array
        const combinedSchedules = allSchedules.flat();
        
        // Sort schedules by time if needed
        const sortedSchedules = combinedSchedules.sort((a, b) => 
          a.from.localeCompare(b.from)
        );
        
        setTimeSlots(sortedSchedules);
      } catch (error) {
        console.error('Error loading schedules:', error);
        setError('Failed to load schedules');
      } finally {
        setIsLoading(false);
      }
    };

    loadSchedules();
  }, [deviceId, refreshTrigger]); 
  const handleDelete = async (index: number) => {
    try {
      const slot = timeSlots[index];
      await deleteSchedule(slot.id.toString());
      
      // Only update the UI after successful deletion
      const newTimeSlots = timeSlots.filter((_, i) => i !== index);
      setTimeSlots(newTimeSlots);
    } catch (error) {
      console.error('Error deleting schedule:', error);
      // Optionally show an error message to the user
      setError('Failed to delete schedule');
    }
  };
  const totalPages = Math.ceil(timeSlots.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = timeSlots.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  
  const rows = Array.from({ length: itemsPerPage }).map((_, idx) => {
    if (idx < currentItems.length) {
      const slot = currentItems[idx];
      return (
        <div key={slot.id} className={styles.timeSlotContainer}>
          <TimeSlot
            startTime={slot.from.substring(0, 5)}
            endTime={slot.to.substring(0, 5)}
            days={convertDaysToText(slot)}
            devices={[slot.device.name]}
            onDelete={() => handleDelete(indexOfFirstItem + idx)}
          />
        </div>
      );
    } else {
      return (
        <div key={`empty-${idx}`} className={styles.emptyTimeSlot}>
          <TimeSlot />
        </div>
      );
    }
  });

  return (
    <div className={styles.wrapper}>
      {rows}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`${styles.pageButton} ${
                currentPage === index + 1 ? styles.activePage : ''
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeSlotList;