import axios from 'axios';
import { toast } from 'react-toastify';

const deleteSchedule = async (scheduleId: string): Promise<void> => {
    try {
        const accessToken = localStorage.getItem('token');
        const url = `https://iot-project-y7dx.onrender.com/api/v1/device/schedule/${scheduleId}`;
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        };
        await axios.delete(url, { headers });
        toast.success('Xóa lịch trình thành công!');
        console.log(`Schedule with ID ${scheduleId} deleted successfully.`);
    } catch (error) {
        console.error('Error deleting schedule:', error);
        toast.error('Có lỗi xảy ra khi xóa lịch trình!');
        throw error;
    }
};

export default deleteSchedule;