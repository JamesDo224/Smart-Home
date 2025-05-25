package com.andy.iot.controller;

import com.andy.iot.model.Device;
import com.andy.iot.model.DeviceStatusLog;
import com.andy.iot.model.Schedule;
import com.andy.iot.repository.DeviceRepository;
import com.andy.iot.repository.DeviceStatusLogRepository;
import com.andy.iot.response.ApiResponse;
import com.andy.iot.service.DeviceControlService;
import com.andy.iot.service.implement.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/device")
@RequiredArgsConstructor
public class DeviceControlController {
    private final DeviceControlService deviceControlService;
    private final DeviceRepository deviceRepo;
    private final ScheduleService scheduleService;
    private final DeviceStatusLogRepository logRepo;
    @PostMapping("/toggle/{device}")
    public ResponseEntity<ApiResponse<Integer>> toggleDevice(@PathVariable String device) {
        try {
            Integer newState = deviceControlService.toggleDevice(device);
            // Cập nhật DeviceStatusLog
            Device device1 = deviceRepo.findByFeedName(device).orElseThrow();
            String currentStatus = newState == 1? "ON" : "OFF";
            DeviceStatusLog log = new DeviceStatusLog();
            log.setDevice(device1);
            log.setStatus(currentStatus);
            log.setSource("USER");
            logRepo.save(log);
            return ResponseEntity.ok(ApiResponse.<Integer>builder()
                    .status(HttpStatus.OK.value())
                    .message("Device " + device + " toggled successfully.")
                    .data(newState)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.<Integer>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message(e.getMessage())
                            .data(null)
                            .build()
            );
        }
    }

    @GetMapping("/state/{device}")
    public ResponseEntity<ApiResponse<Integer>> getDeviceState(@PathVariable String device) {
        try {
            Integer state = deviceControlService.getDeviceState(device);
            return ResponseEntity.ok(ApiResponse.<Integer>builder()
                    .status(HttpStatus.OK.value())
                    .message("Device state retrieved successfully.")
                    .data(state)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.<Integer>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message(e.getMessage())
                            .data(null)
                            .build()
            );
        }
    }

    @GetMapping("/get-all")
    public ResponseEntity<ApiResponse<List<Device>>> getAllDevices() {
        try {
            List<Device> devices = deviceControlService.getAllDevice();
            return ResponseEntity.ok(ApiResponse.<List<Device>>builder()
                    .status(HttpStatus.OK.value())
                    .message("All devices retrieved successfully.")
                    .data(devices)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.<List<Device>>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message(e.getMessage())
                            .data(null)
                            .build()
            );
        }
    }

    @PostMapping("/{id}/schedule")
    public ResponseEntity<ApiResponse<Schedule>> createSchedule(@PathVariable Integer id, @RequestBody Schedule schedule) {
        try {
            Device device = deviceRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Device not found with id: " + id));
            schedule.setDevice(device);
            Schedule createdSchedule = scheduleService.createSchedule(schedule);
            return ResponseEntity.ok(ApiResponse.<Schedule>builder()
                    .status(HttpStatus.OK.value())
                    .message("Schedule created successfully for device id: " + id)
                    .data(createdSchedule)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.<Schedule>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message(e.getMessage())
                            .data(null)
                            .build()
            );
        }
    }

    @GetMapping("/{deviceId}/schedule")
    public ResponseEntity<ApiResponse<List<Schedule>>> getSchedules(@PathVariable Integer deviceId) {
        try {
            List<Schedule> schedules = scheduleService.getSchedules(deviceId);
            return ResponseEntity.ok(ApiResponse.<List<Schedule>>builder()
                    .status(HttpStatus.OK.value())
                    .message("Schedules retrieved successfully for device id: " + deviceId)
                    .data(schedules)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.<List<Schedule>>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message(e.getMessage())
                            .data(null)
                            .build()
            );
        }
    }

    @PutMapping("/schedule/{scheduleId}")
    public ResponseEntity<ApiResponse<Schedule>> updateSchedule(@PathVariable Integer scheduleId, @RequestBody Schedule schedule) {
        try {
            Schedule updatedSchedule = scheduleService.updateSchedule(scheduleId, schedule);
            return ResponseEntity.ok(ApiResponse.<Schedule>builder()
                    .status(HttpStatus.OK.value())
                    .message("Schedule updated successfully for schedule id: " + scheduleId)
                    .data(updatedSchedule)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.<Schedule>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message(e.getMessage())
                            .data(null)
                            .build()
            );
        }
    }

    @DeleteMapping("/schedule/{scheduleId}")
    public ResponseEntity<ApiResponse<Void>> deleteSchedule(@PathVariable Integer scheduleId) {
        try {
            scheduleService.deleteSchedule(scheduleId);
            return ResponseEntity.ok(ApiResponse.<Void>builder()
                    .status(HttpStatus.OK.value())
                    .message("Schedule deleted successfully for schedule id: " + scheduleId)
                    .data(null)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.<Void>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message(e.getMessage())
                            .data(null)
                            .build()
            );
        }
    }
}
