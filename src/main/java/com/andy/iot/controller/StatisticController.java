package com.andy.iot.controller;

import com.andy.iot.dto.SensorRecordAvgDTO;
import com.andy.iot.response.ApiResponse;
import com.andy.iot.service.interf.StatisticServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("/api/v1/statistic")
@RequiredArgsConstructor
public class StatisticController {
    private final StatisticServiceInterface statisticService;

    @GetMapping("/weekly-average")
    public ResponseEntity<ApiResponse<List<SensorRecordAvgDTO>>> getWeeklyAverage(@RequestParam int weekType) {
        try {
            List<SensorRecordAvgDTO> result = statisticService.getWeeklyAverage(weekType);
            return ResponseEntity.ok(ApiResponse.<List<SensorRecordAvgDTO>>builder()
                    .status(HttpStatus.OK.value())
                    .message("Thống kê trung bình theo tuần thành công")
                    .data(result)
                    .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.<List<SensorRecordAvgDTO>>builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message(e.getMessage())
                    .data(null)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.<List<SensorRecordAvgDTO>>builder()
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("Lỗi hệ thống: " + e.getMessage())
                    .data(null)
                    .build());
        }
    }
}
