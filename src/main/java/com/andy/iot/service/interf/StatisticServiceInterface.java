package com.andy.iot.service.interf;

import com.andy.iot.dto.SensorRecordAvgDTO;

import java.util.List;

public interface StatisticServiceInterface {
    List<SensorRecordAvgDTO> getWeeklyAverage(int weekType) throws Exception;
}
