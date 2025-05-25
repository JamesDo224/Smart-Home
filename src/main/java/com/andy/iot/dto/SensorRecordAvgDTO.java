package com.andy.iot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class SensorRecordAvgDTO {
    private Double temperatureAvg;
    private Double humidityAvg;
    private Double lightAvg;
    private Double airQualityAvg;
    private LocalDate date;  // Ngày trong tuần

}
