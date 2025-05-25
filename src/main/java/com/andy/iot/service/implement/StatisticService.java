package com.andy.iot.service.implement;

import com.andy.iot.dto.SensorRecordAvgDTO;
import com.andy.iot.repository.SensorRecordRepository;
import com.andy.iot.service.interf.StatisticServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticService implements StatisticServiceInterface {
    private final SensorRecordRepository sensorRecordRepository;

    private LocalDateTime getStartOfWeek(LocalDateTime dateTime) {
        // Tính ngày đầu tuần (thứ Hai)
        return dateTime.minusDays(dateTime.getDayOfWeek().getValue() - 1);
    }

    private LocalDateTime getEndOfWeek(LocalDateTime startOfWeek) {
        // Tính ngày cuối tuần (Chủ Nhật)
        return startOfWeek.plusDays(6);
    }

    @Override
    // Hàm trả về dữ liệu của tuần hiện tại, tuần trước hoặc tuần trước nữa
    public List<SensorRecordAvgDTO> getWeeklyAverage(int weekType) {
        // Lấy thời gian hiện tại
        LocalDateTime now = LocalDateTime.now();

        LocalDateTime startOfWeek = null;
        LocalDateTime endOfWeek = null;

        // Dựa vào tham số weekType, tính toán tuần cần lấy
        startOfWeek = getStartOfWeek(now.minusWeeks(weekType));
        endOfWeek = getEndOfWeek(startOfWeek);

        List<Object[]> rawData = sensorRecordRepository.findWeeklyAverage(startOfWeek, endOfWeek);
        List<SensorRecordAvgDTO> result = new ArrayList<>();
        for(int i = 0; i < 7; i++){
            List<Object[]> dailyAvg = sensorRecordRepository.findDailyAverage(startOfWeek.toLocalDate().plusDays(i));
            if(!dailyAvg.isEmpty()){
                SensorRecordAvgDTO sensorRecordAvgDTO = new SensorRecordAvgDTO(
                        BigDecimal.valueOf((Double) dailyAvg.getFirst()[0])
                                .setScale(1, RoundingMode.HALF_UP)
                                .doubleValue(),
                        BigDecimal.valueOf((Double) dailyAvg.getFirst()[1])
                                .setScale(1, RoundingMode.HALF_UP)
                                .doubleValue(),
                        BigDecimal.valueOf((Double) dailyAvg.getFirst()[2])
                                .setScale(1, RoundingMode.HALF_UP)
                                .doubleValue(),
                        BigDecimal.valueOf((Double) dailyAvg.getFirst()[3])
                                .setScale(1, RoundingMode.HALF_UP)
                                .doubleValue(),
                        //(LocalDate) dailyAvg.getFirst()[4]
                        ((java.sql.Date) dailyAvg.getFirst()[4]).toLocalDate()
                );
                result.add(sensorRecordAvgDTO);
            }
            else {
                SensorRecordAvgDTO sensorRecordAvgDTO = new SensorRecordAvgDTO(
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        startOfWeek.toLocalDate().plusDays(i)
                );
                result.add(sensorRecordAvgDTO);
            }

        }
        return result;
    }
}
