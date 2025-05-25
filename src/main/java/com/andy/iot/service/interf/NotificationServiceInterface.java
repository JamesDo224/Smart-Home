package com.andy.iot.service.interf;

import com.andy.iot.model.Notification;
import com.andy.iot.response.NotificationResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationServiceInterface {
    void addNotification(String description);
    NotificationResponse getAllNotifications(Pageable pageable);
}
