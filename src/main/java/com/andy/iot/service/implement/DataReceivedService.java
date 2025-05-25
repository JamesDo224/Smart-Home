package com.andy.iot.service.implement;

import com.andy.iot.model.Sensor;
import com.andy.iot.model.SensorRecord;
import com.andy.iot.repository.SensorRecordRepository;
import com.andy.iot.repository.SensorRepository;
import com.andy.iot.service.interf.DataReceivedServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DataReceivedService implements DataReceivedServiceInterface {
    private final SensorRepository sensorRepository;
    private final SensorRecordRepository recordRepository;
    @Override
    public void saveRecord(String feedName, double value) {
        Sensor sensor = sensorRepository.findByFeedName(feedName);
        LocalDateTime now = LocalDateTime.now();
        SensorRecord sensorRecord = new SensorRecord();
        sensorRecord.setTime(now);
        if(feedName == "light"){
            sensorRecord.setValue(String.valueOf((int) value));
        }
        else{
            sensorRecord.setValue(String.valueOf(value));
        }
        sensorRecord.setSensor(sensor);
        recordRepository.save(sensorRecord);
    }
}
