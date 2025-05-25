import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Cell
} from 'recharts';
import styles from './homepage.module.css';
import Sidebar from '../components/sidebar';

interface ChartData {
    date: string;
    quality: number;
    [key: string]: any; // Allow additional properties with any type
}

// Hàm trả về màu dựa trên giá trị của tiêu chí (giống quality)

const getColorByValue = (value: number, selectedDataKey: string) => {
    if (selectedDataKey === 'temperature') {
        if (value < 30) {
            return '#63B15E'; // xanh lá (Tốt)
        } else if (value < 50) {
            return '#FBA669'; // cam (Trung bình)
        } else {
            return '#F57F7F'; // đỏ (Kém)
        }
    } else if (selectedDataKey === 'humidity') {
        if (value < 40) {
            return '#F57F7F'; // đỏ (Kém)
        } else if (value < 70) {
            return '#FBA669'; // cam (Trung bình)
        } else {
            return '#63B15E'; // xanh lá (Tốt)
        }
    } else if (selectedDataKey === 'light') {
        if (value < 30) {
            return '#F57F7F'; // đỏ (Kém)
        } else if (value < 70) {
            return '#FBA669'; // cam (Trung bình)
        } else {
            return '#63B15E'; // xanh lá (Tốt)
        }
    } else if (selectedDataKey === 'airQuality') {
        if (value < 50) {
            return '#63B15E'; // xanh lá (Tốt)
        } else if (value < 100) {
            return '#FBA669'; // cam (Trung bình)
        } else {
            return '#F57F7F'; // đỏ (Kém)
        }
    }
    return '#000'; // Default color if no matching key
};
// Component legend tùy chỉnh gồm các ô màu và chú thích
const CustomizedLegend: React.FC = () => {
    return (
        <div className={styles.customLegendContainer}>
            <Sidebar isLogin={true} />
            {/* <div className={styles.customLegend}>
                <span>
                    <span className={styles.legendColorBox} style={{ backgroundColor: '#63B15E' }}></span>
                    TỐT
                </span>
                <span>
                    <span className={styles.legendColorBox} style={{ backgroundColor: '#FBA669' }}></span>
                    TRUNG BÌNH
                </span>
                <span>
                    <span className={styles.legendColorBox} style={{ backgroundColor: '#F57F7F' }}></span>
                    KÉM
                </span>
            </div> */}
        </div>
    );
};

const Homepage: React.FC = () => {
    // State chứa dữ liệu biểu đồ
    const [data, setData] = useState<ChartData[]>([]);

    // State chứa dữ liệu cảm biến nhận từ websocket
    const [sensorData, setSensorData] = useState({
        temperature: 0,
        humidity: 0,
        light: 0,
        airQuality: 0,
    });

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // Cập nhật tiêu chí với key tương ứng với dữ liệu cảm biến
    const criteria = [
        { label: 'NHIỆT ĐỘ', key: 'temperature' },
        { label: 'ĐỘ ẨM', key: 'humidity' },
        { label: 'CƯỜNG ĐỘ ÁNH SÁNG', key: 'light' },
        { label: 'CO2', key: 'airQuality' },
    ];

    const [selectedCriterion, setSelectedCriterion] = useState(criteria[0]);

    const [currentIndex] = useState(0);
    const [weekType, setWeekType] = useState(0); // Tuần hiện tại
    // Hàm gọi API để lấy dữ liệu thống kê trung bình theo tuần
    const fetchWeeklyAverage = async (weekType: number = 0) => {
        try {
            const accessToken = localStorage.getItem('token'); 
            const response = await fetch(`https://iot-project-y7dx.onrender.com/api/v1/statistic/weekly-average?weekType=${weekType}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}` // Replace with your actual token
            }
            });
            const result = await response.json();
            
            if (result.data) {
            // Chuyển đổi dữ liệu API thành định dạng mà biểu đồ yêu cầu
            const transformedData = result.data.map((item: { date: string; [key: string]: any }) => ({
                date: item.date,
                value: item[selectedDataKey+'Avg']  // Sử dụng selectedDataKey để lấy giá trị thích hợp (temperatureAvg, humidityAvg, ...)
            }));
            
            setData(transformedData);  // Cập nhật dữ liệu vào state
            console.log('Transformed Data:', transformedData);  // Kiểm tra dữ liệu sau khi chuyển đổi
            }
        } catch (error) {
            console.error('Error fetching weekly data:', error);
        }
    };
    useEffect(() => {
        // Chỉ gọi API khi selectedCriterion thay đổi
        fetchWeeklyAverage(weekType);
    }, [selectedCriterion, weekType]);

    useEffect(() => {
        

        // Cập nhật dữ liệu WebSocket
        const ws = new WebSocket('wss://iot-project-y7dx.onrender.com/ws/data');

        ws.onopen = () => {
            console.log('Connected to WebSocket');
        };

        ws.onmessage = (event) => {
            // Dữ liệu nhận về dạng JSON: {"temperature":3.14,"humidity":60.3,"light":70,"airQuality":0.0}
            const sensor = JSON.parse(event.data);
            console.log('Received sensor data:', sensor);
            setSensorData({
                temperature: sensor.temperature ?? 0,
                humidity: sensor.humidity ?? 0,
                light: sensor.light ?? 0,
                airQuality: sensor.airQuality ?? 0,
            });
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
  
    const selectedDataKey = selectedCriterion.key;
    const displayedData = data.slice(currentIndex, currentIndex + 7);

    const goToPrevious = () => {
        const newWeekType = weekType + 1;  // Tăng tuần đi 1
        setWeekType(newWeekType);  // Cập nhật lại chỉ số tuần hiện tại
        fetchWeeklyAverage(newWeekType);  // Gọi API với tham số weekType tăng lên 1
       
        
    };

    const goToNext = () => {
        if (weekType > 0) {
            const newWeekType = weekType - 1;  // Giảm tuần đi 1
            setWeekType(newWeekType);  // Cập nhật lại chỉ số tuần hiện tại
            fetchWeeklyAverage(newWeekType);  // Gọi API với tham số weekType giảm đi 1
        }
    };

    // Function to handle when a criterion is clicked
    const handleCriterionClick = (criterion: any) => {
        setSelectedCriterion(criterion);
     
       
    };

    return (
        <div className={styles.mainContent}>
            {/* Các chỉ số (metrics) */}
            <div className={styles.metricsContainer}>
                {criteria.map((criterion, index) => (
                    <div
                        key={index}
                        className={`${styles.metricCard} ${selectedCriterion.label === criterion.label ? styles.selected : ''}`}
                        onClick={() => handleCriterionClick(criterion)}
                    >
                        <div className={styles.metricIcon}>
                            {criterion.label === 'NHIỆT ĐỘ' && '🌡️'}
                            {criterion.label === 'ĐỘ ẨM' && '💧'}
                            {criterion.label === 'CƯỜNG ĐỘ ÁNH SÁNG' && '☀️'}
                            {criterion.label === 'CO2' && '🌱'}
                        </div>
                        <div className={styles.metricInfo}>
                            <p>{criterion.label}</p>
                            <h2>
                                {/* Kiểm tra nếu sensorData có giá trị hợp lệ */}
                                {criterion.label === 'NHIỆT ĐỘ'
                                    ? `${sensorData.temperature || 0}°C`
                                    : criterion.label === 'ĐỘ ẨM'
                                    ? `${sensorData.humidity || 0}%`
                                    : criterion.label === 'CƯỜNG ĐỘ ÁNH SÁNG'
                                    ? `${sensorData.light || 0} lux`
                                    : criterion.label === 'CO2'
                                    ? `${sensorData.airQuality || 0}%`
                                    : ''}
                            </h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* Biểu đồ */}
            <div className={styles.chartContainer}>
            <h3 className={styles.chartName}>THỐNG KÊ {selectedCriterion.label} GẦN ĐÂY</h3>
            <div className={styles.chartWrapper}>
                <button className={styles.detailButton} onClick={goToPrevious} >{"<"}</button>

                <BarChart width={940} height={350} data={displayedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Legend content={<CustomizedLegend />} />
    <Bar dataKey="value" name={selectedCriterion.label} radius={[10, 10, 10, 10]} barSize={20}>
        {displayedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColorByValue(entry.value, selectedDataKey)} />
        ))}
        {displayedData.map((entry, index) => {
            const baseColor = getColorByValue(entry.value, selectedDataKey);
            const fillColor = activeIndex === index ? "#000" : baseColor;
            return (
                <Cell
                    key={`cell-hover-${index}`}
                    fill={fillColor}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                />
            );
        })}
    </Bar>
</BarChart>


                    <button className={styles.detailButton} onClick={goToNext} >{">"}</button>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
