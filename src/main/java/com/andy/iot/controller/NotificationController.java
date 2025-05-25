package com.andy.iot.controller;

import com.andy.iot.model.Device;
import com.andy.iot.model.Notification;
import com.andy.iot.response.ApiResponse;
import com.andy.iot.response.NotificationResponse;
import com.andy.iot.service.interf.NotificationServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notification")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationServiceInterface notificationService;

    @GetMapping("/get-all")
    public ResponseEntity<ApiResponse<NotificationResponse>> getAllNotifications(@RequestParam(defaultValue = "0") int page,
                                                                                  @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            NotificationResponse response = notificationService.getAllNotifications(pageable);
            return ResponseEntity.ok(ApiResponse.<NotificationResponse>builder()
                    .status(HttpStatus.OK.value())
                    .message("All notifications retrieved successfully.")
                    .data(response)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.<NotificationResponse>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message(e.getMessage())
                            .data(null)
                            .build()
            );
        }
    }
}
