import axios from 'axios';

const BASE_URL = 'https://iot-project-y7dx.onrender.com/api/v1/device';

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
  device: {
    id: number;
    name: string;
    feedName: string;
  };
}

interface ScheduleResponse {
  status: number;
  message: string;
  data: Schedule[];
}

// Create a function to fetch all schedules for a device
export const fetchDeviceSchedule = async (deviceId: number): Promise<Schedule[]> => {
  try {
    const accessToken = localStorage.getItem('token');
   
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
    };
    const response = await axios.get<ScheduleResponse>(`${BASE_URL}/${deviceId}/schedule`, { headers });
    const { status, data } = response.data;
    
    if (status === 200 && data.length > 0) {
     
      console.log('Response:', data); // Log the response data for debugging
      return data; // Return all schedules
    }
    return [];
  } catch (error) {
    console.error('Error fetching device schedules:', error);
    return [];
  }
};