package com.andy.iot.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class SensorDataResponse {
    private double temperature;
    private double humidity;
    private int light;
    private double airQuality;
}
