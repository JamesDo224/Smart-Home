package com.andy.iot.service;

import com.andy.iot.model.Notification;
import com.andy.iot.model.ServerAccount;
import com.andy.iot.repository.NotificationRepository;
import com.andy.iot.repository.ServerAccountRepository;
import com.andy.iot.response.SensorDataResponse;
import com.andy.iot.service.interf.DataReceivedServiceInterface;
import com.andy.iot.service.interf.NotificationServiceInterface;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdafruitService {
    private final RestTemplate restTemplate;
    private final DataReceivedServiceInterface dataReceivedService;
    private final NotificationServiceInterface notificationService;

    @Value("${adafruit.base-url}")
    private String baseUrl;

    @Value("${adafruit.api-key}")
    private String apiKey;

    // lấy dữ liệu từ API Adafruit
    public SensorDataResponse fetchData() {
        SensorDataResponse response = new SensorDataResponse();

        double temperature = getSensorValue("temp");
        double humidity = getSensorValue("humi");
        int light = (int)getSensorValue("light");
        double conc = getSensorValue("conc");

        dataReceivedService.saveRecord("temp", temperature);
        dataReceivedService.saveRecord("humi", humidity);
        dataReceivedService.saveRecord("light", (double)light);
        dataReceivedService.saveRecord("conc", conc);

        // Kiểm tra ngưỡng và gửi tín hiệu/lưu thông báo
        if (temperature > 60) {
            sendSignalAndLog("1", "Temperature exceeded 60°C: " + temperature);
        }
        if (humidity > 70) {
            sendSignalAndLog("2", "Humidity exceeded 70%: " + humidity);
        }
        if (light > 600) {
            sendSignalAndLog("3", "Light intensity exceeded 600lux: " + light);
        }
        if (conc > 0.1) {
            sendSignalAndLog("4", "Air quality exceeded 10%: " + conc);
        }

        response.setTemperature(temperature);
        response.setHumidity(humidity);
        response.setLight(light);
        response.setAirQuality(conc);

        return response;
    }

    // Gọi API và lấy giá trị từ feed
    private double getSensorValue(String feed) {
        try {
            String url = String.format("%s/%s/data/last?X-AIO-Key=%s", baseUrl, feed, apiKey);
            String jsonResponse = restTemplate.getForObject(url, String.class);

            // Parse JSON để lấy giá trị "value"
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            String valueStr = rootNode.path("value").asText();

            return Double.parseDouble(valueStr);
        } catch (Exception e) {
            e.printStackTrace();
            return 0.0; //Double.NaN ;
        }
    }

    public void sendSignalToAdafruit(String signal) {
        if (signal == null || signal.trim().isEmpty()) {
            throw new IllegalArgumentException("Signal must be a non-empty string");
        }

        String url = "https://io.adafruit.com/api/v2/Anhdo020204/feeds/telegram/data";
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-AIO-Key", apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String payload = String.format("{\"value\": \"%s\"}", signal);
        HttpEntity<String> request = new HttpEntity<>(payload, headers);

        try {
            restTemplate.exchange(url, HttpMethod.POST, request, String.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send signal to Adafruit IO", e);
        }
    }

    private void sendSignalAndLog(String signal, String description) {
        try {
            // Gửi tín hiệu tới Adafruit IO
            sendSignalToAdafruit(signal);
        } catch (Exception e) {
            // Log lỗi nhưng không làm gián đoạn lưu thông báo
            System.out.println("Failed to send signal");
        }

        // Lưu thông báo vào database
        notificationService.addNotification(description);
    }
}